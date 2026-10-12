-- Educational management only. No device, message, or contact policies are changed.
-- Prerequisite: learning_progress (SETUP-PRODUCTION.sql).
BEGIN;
CREATE TABLE IF NOT EXISTS public.education_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 80)
);
ALTER TABLE public.education_admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.education_admins FROM anon, authenticated;
GRANT SELECT ON public.education_admins TO authenticated;
DROP POLICY IF EXISTS education_admin_self ON public.education_admins;
CREATE POLICY education_admin_self ON public.education_admins FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_education_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS (SELECT 1 FROM public.education_admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_education_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_education_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.education_invites (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 admin_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.education_admins(user_id) ON DELETE CASCADE,
 label text NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 80),
 code uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
 claimed_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.education_invites ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.education_invites FROM anon, authenticated;
GRANT SELECT, DELETE ON public.education_invites TO authenticated;
GRANT INSERT (label) ON public.education_invites TO authenticated;
DROP POLICY IF EXISTS education_invites_owner ON public.education_invites;
CREATE POLICY education_invites_owner ON public.education_invites FOR ALL TO authenticated
USING (admin_id = auth.uid() AND public.is_education_admin())
WITH CHECK (admin_id = auth.uid() AND public.is_education_admin());

CREATE TABLE IF NOT EXISTS public.education_enrollments (
 admin_id uuid NOT NULL REFERENCES public.education_admins(user_id) ON DELETE CASCADE,
 student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 80),
 status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
 consent_version text NOT NULL DEFAULT 'education-v1',
 consent_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (admin_id, student_id),
 CHECK (admin_id <> student_id)
);
ALTER TABLE public.education_enrollments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.education_enrollments FROM anon, authenticated;
GRANT SELECT, DELETE ON public.education_enrollments TO authenticated;
GRANT UPDATE (status) ON public.education_enrollments TO authenticated;
DROP POLICY IF EXISTS education_enrollment_read ON public.education_enrollments;
CREATE POLICY education_enrollment_read ON public.education_enrollments FOR SELECT TO authenticated
USING (student_id = auth.uid() OR (admin_id = auth.uid() AND public.is_education_admin()));
DROP POLICY IF EXISTS education_enrollment_update ON public.education_enrollments;
CREATE POLICY education_enrollment_update ON public.education_enrollments FOR UPDATE TO authenticated
USING (admin_id = auth.uid() AND public.is_education_admin())
WITH CHECK (admin_id = auth.uid() AND public.is_education_admin());
DROP POLICY IF EXISTS education_enrollment_delete ON public.education_enrollments;
CREATE POLICY education_enrollment_delete ON public.education_enrollments FOR DELETE TO authenticated
USING (student_id = auth.uid() OR (admin_id = auth.uid() AND public.is_education_admin()));

-- Allows the learner to see the manager's name BEFORE consenting. No roster is exposed.
CREATE OR REPLACE FUNCTION public.preview_education_invite(p_code uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE manager_name text;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
 SELECT a.display_name INTO manager_name FROM public.education_invites i
 JOIN public.education_admins a ON a.user_id = i.admin_id
 WHERE i.code = p_code AND i.claimed_at IS NULL AND i.expires_at > now();
 IF manager_name IS NULL THEN RAISE EXCEPTION 'INVITE_INVALID'; END IF;
 RETURN manager_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_education_invite(p_code uuid, p_name text, p_consent boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE invitation public.education_invites;
BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'AUTH_REQUIRED'; END IF;
 IF p_consent IS DISTINCT FROM true THEN RAISE EXCEPTION 'CONSENT_REQUIRED'; END IF;
 IF p_name IS NULL OR length(btrim(p_name)) NOT BETWEEN 1 AND 80 THEN RAISE EXCEPTION 'NAME_INVALID'; END IF;
 SELECT * INTO invitation FROM public.education_invites WHERE code = p_code FOR UPDATE;
 IF NOT FOUND OR invitation.claimed_at IS NOT NULL OR invitation.expires_at <= now() THEN RAISE EXCEPTION 'INVITE_INVALID'; END IF;
 IF invitation.admin_id = auth.uid() THEN RAISE EXCEPTION 'SELF_INVITE'; END IF;
 INSERT INTO public.education_enrollments(admin_id,student_id,display_name)
 VALUES (invitation.admin_id,auth.uid(),btrim(p_name));
 UPDATE public.education_invites SET claimed_at = now() WHERE id = invitation.id;
END;
$$;

-- Only a narrow educational summary; never grants admins access to whole progress rows,
-- private conversations, profiles, device tables, or other managers' students.
CREATE OR REPLACE FUNCTION public.education_roster()
RETURNS TABLE(student_id uuid, display_name text, status text, consent_at timestamptz, synced_at timestamptz, summary jsonb)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 IF NOT public.is_education_admin() THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
 RETURN QUERY SELECT e.student_id,e.display_name,e.status,e.consent_at,
 CASE WHEN e.status = 'active' THEN p.updated_at END,
 CASE WHEN e.status = 'active' AND p.user_id IS NOT NULL THEN jsonb_build_object(
 'completedLessonIds',p.progress->'completedLessonIds',
 'learnedEssential504Words',p.progress->'learnedEssential504Words',
 'totalMinutes',p.progress->'totalMinutes',
 'currentStreak',p.progress->'currentStreak') END
 FROM public.education_enrollments e LEFT JOIN public.learning_progress p ON p.user_id = e.student_id
 WHERE e.admin_id = auth.uid() ORDER BY e.consent_at DESC;
END;
$$;
REVOKE ALL ON FUNCTION public.preview_education_invite(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_education_invite(uuid,text,boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.education_roster() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.preview_education_invite(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_education_invite(uuid,text,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.education_roster() TO authenticated;
COMMIT;

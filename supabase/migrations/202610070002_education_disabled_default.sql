-- Default-off switch for the educational admin backend.
-- Does not disable students' ability to withdraw previous consent.
BEGIN;
CREATE TABLE IF NOT EXISTS public.education_feature_settings (
 id boolean PRIMARY KEY DEFAULT true CHECK (id),
 management_enabled boolean NOT NULL DEFAULT false
);
ALTER TABLE public.education_feature_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.education_feature_settings FROM PUBLIC, anon, authenticated;
INSERT INTO public.education_feature_settings(id,management_enabled) VALUES (true,false)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.education_management_enabled()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT COALESCE((SELECT management_enabled FROM public.education_feature_settings WHERE id),false);
$$;
REVOKE ALL ON FUNCTION public.education_management_enabled() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.education_management_enabled() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_education_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT public.education_management_enabled() AND EXISTS (
 SELECT 1 FROM public.education_admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_education_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_education_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.preview_education_invite(p_code uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE manager_name text;
BEGIN
 IF NOT public.education_management_enabled() THEN RAISE EXCEPTION 'EDUCATION_DISABLED'; END IF;
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
 IF NOT public.education_management_enabled() THEN RAISE EXCEPTION 'EDUCATION_DISABLED'; END IF;
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

REVOKE ALL ON FUNCTION public.preview_education_invite(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.accept_education_invite(uuid,text,boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.preview_education_invite(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_education_invite(uuid,text,boolean) TO authenticated;
COMMIT;

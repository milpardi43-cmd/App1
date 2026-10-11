import type { GuidedLesson, LearningUnit, WriteExercise } from './learningDesign';

export interface LessonSpec {
  id: string; title: string; goal: string; situation: string; pattern: string; sound: string;
  dialogue: [string, string][];
  examples: [string, string][];
  listen: { text: string; fa: string; question: string; choices: string[]; correct: number };
  order: [string, string];
  reading?: { text:string; question:string; choices:string[]; correct:number; why:string };
  taskNoteFa?: string;
  write: { prompt: string; answers: string[]; hint: string; why: string };
  mission: { prompt: string; answers: string[]; hint: string; why: string };
}
export function buildUnit(id: string, title: string, oralMissionFa: string, specs: LessonSpec[], level: LearningUnit['level'] = 'A1'): LearningUnit {
  const writing = (spec: LessonSpec, mission: boolean): WriteExercise => {
    const task = mission ? spec.mission : spec.write;
    return { id: `${spec.id}-${mission ? 'mission' : 'write'}`, objectiveId: `${spec.id}-goal`, skill: 'writing', kind: 'write', promptFa: task.prompt, acceptedAnswers: task.answers, sample: task.answers[0], hintFa: task.hint, explanationFa: task.why, ...(spec.taskNoteFa ? {taskNoteFa:spec.taskNoteFa} : {}) };
  };
  const lessons: GuidedLesson[] = specs.map((spec,i) => {
    const objectiveId = `${spec.id}-goal`;
    // Rotate rather than randomly shuffle: stable tokens and IDs keep drafts valid.
    const words = spec.order[0].split(' ');
    return {
      id: spec.id, title: spec.title, canDoFa: spec.goal, objectiveIds: [objectiveId], prerequisiteIds: i ? [specs[i-1].id] : [],
      situationFa: spec.situation, patternFa: spec.pattern, pronunciationFa: spec.sound,
      dialogue: spec.dialogue.map(([text,fa],index)=>({speaker:index%2?'شما':'همراه',text,fa})),
      examples: spec.examples.map(([text,fa])=>({text,fa})),
      exercises: [
        { id:`${spec.id}-listen`,objectiveId,skill:'listening',kind:'choice',audioText:spec.listen.text,transcriptFa:spec.listen.fa,promptFa:spec.listen.question,choices:spec.listen.choices.map((label,j)=>({id:`c${j}`,label})),correctChoice:`c${spec.listen.correct}`,explanationFa:spec.listen.fa },
        spec.reading ? {id:`${spec.id}-read`,objectiveId,skill:'reading',kind:'choice',readingText:spec.reading.text,promptFa:spec.reading.question,choices:spec.reading.choices.map((label,j)=>({id:`c${j}`,label})),correctChoice:`c${spec.reading.correct}`,explanationFa:spec.reading.why} : { id:`${spec.id}-order`,objectiveId,skill:'writing',kind:'order',tokens:[...words.slice(1),words[0]],answer:spec.order[0],promptFa:`جمله را بسازید: «${spec.order[1]}»`,explanationFa:spec.pattern },
        writing(spec,false),
      ],
    };
  });
  return {id,version:1,language:'de',level,title,objectives:specs.map(s=>({id:`${s.id}-goal`,canDoFa:s.goal})),lessons,mission:specs.map(s=>writing(s,true)),oralMissionFa};
}


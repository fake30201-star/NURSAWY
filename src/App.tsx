import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { HomeSection } from './components/HomeSection';
import { AiDictionarySection } from './components/AiDictionarySection';
import { OsceSkillsSection } from './components/OsceSkillsSection';
import { DripCalculatorSection } from './components/DripCalculatorSection';
import { EmergencySection } from './components/EmergencySection';
import { HandoverSection } from './components/HandoverSection';
import { ClinicalCaseSimulator } from './components/ClinicalCaseSimulator';
import { EditableText } from './components/EditableText';
import { OSCE_SKILLS } from './data/clinicalData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { supabase } from './lib/supabaseClient';

function buildEmptyProgress(): Record<string, boolean[]> {
  const initial: Record<string, boolean[]> = {};
  OSCE_SKILLS.forEach((skill) => {
    initial[skill.id] = new Array(skill.steps.length).fill(false);
  });
  return initial;
}

function AppShell() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // OSCE Skills state: { skillId: [true, false, ...] }
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, boolean[]>>(() => {
    try {
      const saved = localStorage.getItem('nursawy_osce_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return buildEmptyProgress();
  });

  // بيمنع إن أول تحميل للتقدم من Supabase يترفع تاني فورًا كـ "حفظ" لنفس البيانات
  const skipNextRemoteWrite = useRef(false);
  const progressLoadedForUser = useRef<string | null>(null);

  // لو المستخدم مسجل دخوله: نجيب تقدمه المحفوظ من Supabase، أو نرفع تقدمه المحلي أول مرة لو حسابه جديد
  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn || !user) {
      progressLoadedForUser.current = null;
      return;
    }

    if (progressLoadedForUser.current === user.id) return; // متعملش تحميل تاني لنفس المستخدم
    progressLoadedForUser.current = user.id;

    (async () => {
      const { data, error } = await supabase
        .from('osce_progress')
        .select('skill_id, completed_steps')
        .eq('user_id', user.id);

      if (error) {
        console.error('تعذر تحميل تقدم OSCE من الحساب:', error.message);
        return;
      }

      if (data && data.length > 0) {
        // فيه تقدم محفوظ في الحساب بالفعل: نستخدمه هو
        const remoteMap: Record<string, boolean[]> = buildEmptyProgress();
        for (const row of data) {
          remoteMap[row.skill_id] = row.completed_steps as boolean[];
        }
        skipNextRemoteWrite.current = true;
        setCompletedStepsMap(remoteMap);
      } else {
        // حساب جديد مفيهوش تقدم محفوظ لسه: نرفع أي تقدم محلي موجود على الجهاز ده كبداية لحسابه
        const rows = Object.entries(completedStepsMap)
          .filter(([, steps]) => steps.some(Boolean))
          .map(([skill_id, completed_steps]) => ({
            user_id: user.id,
            skill_id,
            completed_steps,
            updated_at: new Date().toISOString(),
          }));
        if (rows.length > 0) {
          await supabase.from('osce_progress').upsert(rows);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id, authLoading]);

  // حفظ التقدم محليًا دايمًا (نسخة احتياطية سريعة، وتشتغل حتى للزوار الغير مسجلين)
  useEffect(() => {
    try {
      localStorage.setItem('nursawy_osce_progress', JSON.stringify(completedStepsMap));
    } catch (e) {
      console.error(e);
    }
  }, [completedStepsMap]);

  // Calculate global progress
  let totalGlobalSteps = 0;
  let totalGlobalCompleted = 0;
  OSCE_SKILLS.forEach((skill) => {
    const steps = completedStepsMap[skill.id] || [];
    totalGlobalSteps += skill.steps.length;
    totalGlobalCompleted += steps.filter(Boolean).length;
  });
  const overallProgress = totalGlobalSteps > 0 ? Math.round((totalGlobalCompleted / totalGlobalSteps) * 100) : 0;

  // بيحفظ تعديل مهارة واحدة في حساب المستخدم على Supabase (لو مسجل دخوله)
  const persistSkillProgress = async (skillId: string, steps: boolean[]) => {
    if (skipNextRemoteWrite.current) {
      skipNextRemoteWrite.current = false;
      return;
    }
    if (!isLoggedIn || !user) return;
    const { error } = await supabase.from('osce_progress').upsert({
      user_id: user.id,
      skill_id: skillId,
      completed_steps: steps,
      updated_at: new Date().toISOString(),
    });
    if (error) console.error('تعذر حفظ تقدم المهارة في الحساب:', error.message);
  };

  const handleToggleStep = (skillId: string, stepIndex: number) => {
    setCompletedStepsMap((prev) => {
      const skillSteps = prev[skillId] ? [...prev[skillId]] : new Array(5).fill(false);
      skillSteps[stepIndex] = !skillSteps[stepIndex];
      persistSkillProgress(skillId, skillSteps);
      return { ...prev, [skillId]: skillSteps };
    });
  };

  const handleResetSkill = (skillId: string) => {
    setCompletedStepsMap((prev) => {
      const skill = OSCE_SKILLS.find((s) => s.id === skillId);
      const count = skill ? skill.steps.length : 5;
      const resetSteps = new Array(count).fill(false);
      persistSkillProgress(skillId, resetSteps);
      return { ...prev, [skillId]: resetSteps };
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Ambient Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <HomeSection onNavigate={setActiveTab} overallProgress={overallProgress} />
        )}

        {activeTab === 'dictionary' && <AiDictionarySection />}

        {activeTab === 'skills' && (
          <OsceSkillsSection
            completedStepsMap={completedStepsMap}
            onToggleStep={handleToggleStep}
            onResetSkill={handleResetSkill}
          />
        )}

        {activeTab === 'calculator' && <DripCalculatorSection />}

        {activeTab === 'emergency' && <EmergencySection />}

        {activeTab === 'handover' && <HandoverSection />}

        {activeTab === 'case-sim' && <ClinicalCaseSimulator />}

        {activeTab === 'login' && <LoginPage onSuccess={() => setActiveTab('home')} />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/10 py-6 text-center text-xs text-slate-500 dir-rtl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <EditableText
            contentKey="footer.copyright"
            defaultValue="© 2026 Nursawy - منصة التمريض الإكلينيكي والتشخيص السريري بالذكاء الاصطناعي"
            as="p"
          />
          <div className="flex items-center gap-4 text-slate-400">
            <EditableText
              contentKey="footer.supervision"
              defaultValue="إشراف وتطوير إكلينيكي: محمد ⚡"
              as="span"
            />
            <EditableText
              contentKey="footer.poweredBy"
              defaultValue="مدعوم بالذكاء الاصطناعي"
              as="span"
            />
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <AppShell />
      </SiteContentProvider>
    </AuthProvider>
  );
}

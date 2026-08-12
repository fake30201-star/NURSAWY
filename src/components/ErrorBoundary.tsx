import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
}

// Error Boundary: بيحمي كل قسم من الموقع لوحده. لو حصل خطأ برمجي غير متوقع
// جوه قسم معيّن (زي محاكي الحالات أو القاموس)، القسم ده بس اللي بيعطل،
// وباقي الموقع (الهيدر والتابات التانية) يفضل شغال عادي تمامًا.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`حصل خطأ في قسم "${this.props.sectionName || 'غير معروف'}":`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="dir-rtl bg-red-950/20 border border-red-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">حصل خطأ غير متوقع</h3>
            <p className="text-sm text-slate-400 mt-1">
              معلش، القسم ده واجه مشكلة تقنية. تقدر تحاول تاني أو تنتقل لقسم تاني من القائمة فوق.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" /> حاول تاني
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" /> تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

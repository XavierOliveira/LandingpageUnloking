import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, 
  BarChart3, 
  Zap, 
  Link as LinkIcon, 
  Smartphone, 
  Shield, 
  Calendar, 
  FileText, 
  Target, 
  Search,
  Lock,
  Key,
  Fingerprint, 
  Share2,
  Menu,
  X,
  Play,
  Linkedin,
  Instagram,
  Facebook,
  ChevronRight,
  CheckCircle2,
  Globe,
  Code,
  Terminal,
  Cpu,
  Rocket,
  Camera,
  Layout,
  MessageSquare,
  Filter,
  Cloud,
  MessageCircle,
  Check,
  Sparkles,
  Workflow,
  Brain
} from 'lucide-react';

// --- Animated Components ---

// 1. Scroll Progress Component
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = totalScroll / windowHeight;
      setScrollProgress(scroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="scroll-progress-bar" 
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  );
};

// 2. Magnetic Button Component
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className = "", onClick, href }) => {
  const buttonRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    
    // Limit movement to max 20px
    const xMove = x * 0.2;
    const yMove = y * 0.2;
    
    setPosition({ x: xMove, y: yMove });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={buttonRef as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out-expo ${className}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </Component>
  );
};

// 3. Count Up Component
interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, prefix = "0" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function
      const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
      
      setCount(Math.floor(easeOutQuart(percentage) * end));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="tabular-nums">
      {count < 10 && prefix}{count}
    </div>
  );
};

// 4. Scroll Reveal Component
interface RevealOnScrollProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out-expo ${className} ${
        isVisible 
          ? "opacity-100 translate-y-0 translate-x-0 blur-0 scale-100" 
          : "opacity-0 translate-y-12 blur-sm scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// 5. 3D Tilt Card Component for Feature Grid
interface TiltCardProps {
  children?: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = "" }) => {
  const [transform, setTransform] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    setTransform(`perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
};

// 6. Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{x: number, y: number, vx: number, vy: number, size: number, phase: number}> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 60);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        const floatY = Math.sin(time * 0.001 + p.phase) * 0.5;
        p.y += floatY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(209, 213, 219, ${0.1 + Math.sin(time * 0.002 + p.phase) * 0.05})`; // gray-300 tint
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const partners = ["Pipedrive", "HubSpot", "Make", "Salesforce", "Monday.com"];
  
  const navItems = [
    { name: "Funcionalidades", href: "#features" },
    { name: "Serviços", href: "#services" },
    { name: "Soluções", href: "#solutions" },
  ];

  const footerItems = [
    "Company",
    "AI Services",
    "AI Agents",
    "Solutions",
    "Team Extensions",
    "Development Services"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black font-sans selection:bg-gray-500 selection:text-white overflow-x-hidden">
      <ScrollProgress />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brand-black/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <img 
              src="https://cdn.prod.website-files.com/6478bc682b0c0435582bea36/6929cce7d212c922e37aa97d_unlocking%20logo%20branco.png" 
              alt="Unlocking Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
              >
                {item.name}
              </a>
            ))}
            
            <div className="ml-4 animate-pop-interval">
              <MagneticButton href="#contact" className="relative px-6 py-2.5 bg-metallic text-white text-sm font-bold rounded-full hover:brightness-110 animate-glow transition-all duration-300 overflow-hidden group hover:scale-105">
                <span className="relative z-10">Agendar Consultoria</span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
              </MagneticButton>
            </div>
          </div>

          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-brand-black border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-10 fade-in duration-300">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                onClick={() => setIsMenuOpen(false)} 
                className="text-gray-400 hover:text-white font-medium py-2 border-b border-white/5 last:border-0"
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="w-full py-3 bg-metallic text-white rounded-lg font-bold animate-glow text-center block animate-pop-interval mt-2">
              Agendar Consultoria
            </a>
          </div>
        )}
      </nav>

      {/* 1. HERO SECTION - SALES DASHBOARD STYLE */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-screen flex items-center justify-center bg-brand-black/90">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none mix-blend-overlay" />

        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: 'linear-gradient(rgba(156, 163, 175, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.5) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}
        />

        {/* Animated Growth Chart Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="chartGradient1" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="chartGradient2" x1="0%" y1="100%" x2="100%" y2="10%">
              <stop offset="0%" stopColor="#6b7280" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9ca3af" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Growth Line 1 - Aggressive uptrend */}
          <path
            d="M 0 900 Q 200 850, 300 700 T 500 500 T 700 300 T 900 100"
            fill="none"
            stroke="url(#chartGradient1)"
            strokeWidth="3"
            className="animate-[dash_3s_ease-out_infinite] stroke-dash-500"
          />

          {/* Growth Line 2 - Secondary trend */}
          <path
            d="M 0 950 Q 250 900, 350 800 T 550 650 T 750 450 T 950 250"
            fill="none"
            stroke="url(#chartGradient2)"
            strokeWidth="2"
            className="animate-[dash_3s_ease-out_infinite] stroke-dash-500"
            style={{animationDelay: '1s'}}
          />

          {/* Area under curve */}
          <path
            d="M 0 900 Q 200 850, 300 700 T 500 500 T 700 300 T 900 100 L 1000 1000 L 0 1000 Z"
            fill="url(#chartGradient1)"
            opacity="0.05"
          />
        </svg>

        {/* Floating Metrics Cards */}
        <div className="absolute top-[15%] left-[10%] opacity-60 animate-float z-0 hidden md:block"
             style={{animationDelay: '0s', animationDuration: '6s'}}>
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg">
            <div className="text-xs text-gray-400 mb-1">Conversão</div>
            <div className="text-2xl font-bold text-gray-200 flex items-center gap-2">
              +32%
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-2 0V9.414l-3.293 3.293a1 1 0 01-1.414 0L8 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0L12 10.586 14.586 8H13a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="absolute top-[60%] right-[8%] opacity-60 animate-float z-0 hidden md:block"
             style={{animationDelay: '1s', animationDuration: '7s'}}>
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg">
            <div className="text-xs text-gray-400 mb-1">Revenue</div>
            <div className="text-2xl font-bold text-gray-200">€48K</div>
          </div>
        </div>

        <div className="absolute bottom-[25%] left-[15%] opacity-60 animate-float z-0 hidden lg:block"
             style={{animationDelay: '2s', animationDuration: '8s'}}>
          <div className="bg-gray-800/40 backdrop-blur-md border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg">
            <div className="text-xs text-gray-400 mb-1">Leads</div>
            <div className="text-2xl font-bold text-gray-200 flex items-center gap-2">
              1,247
              <span className="text-xs text-gray-400">+18%</span>
            </div>
          </div>
        </div>

        {/* Central Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-3xl pointer-events-none z-0 animate-pulse-slow" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <RevealOnScroll delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors animate-float cursor-default">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse shadow-[0_0_10px_#9ca3af]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Transformação Digital</span>
            </div>
          </RevealOnScroll>
          
          <div className="mb-8 relative">
            <RevealOnScroll delay={100}>
              <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] text-white drop-shadow-2xl">
                Acelera o <br /> Crescimento
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
               <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-500 pb-2">
                Da Tua Empresa
              </h1>
            </RevealOnScroll>
          </div>
          
          <RevealOnScroll delay={400}>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Implementamos sistemas de CRM, automação e processos comerciais que transformam equipas e multiplicam resultados.
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={500}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16 w-full">
              <div className="w-full md:w-auto animate-pop-interval">
                <MagneticButton href="#contact" className="w-full md:w-auto px-8 py-4 bg-metallic text-white font-bold rounded-full hover:brightness-110 transition-all flex items-center justify-center gap-2 group animate-glow relative overflow-hidden hover:scale-105 duration-300 shadow-[0_0_20px_rgba(156,163,175,0.3)]">
                  <span className="relative z-10 flex items-center gap-2">
                    Agendar Consultoria Gratuita
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                </MagneticButton>
              </div>
              <div className="w-full md:w-auto animate-pop-interval">
                <MagneticButton href="#features" className="w-full md:w-auto px-8 py-4 bg-white/5 border border-gray-500/30 text-gray-200 font-bold rounded-full hover:bg-white/10 hover:border-gray-500/60 animate-glow transition-all flex items-center justify-center gap-2 group relative overflow-hidden hover:scale-105 duration-300 backdrop-blur-sm">
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="w-4 h-4 fill-current" />
                    Ver Como Funciona
                  </span>
                </MagneticButton>
              </div>
            </div>
          </RevealOnScroll>

          {/* Trust Indicators (Onyx Style) */}
          <RevealOnScroll delay={600}>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-400">
               <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                 <Shield className="w-4 h-4 text-brand-blue" /> Privacy First
               </span>
               <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                 <Zap className="w-4 h-4 text-brand-blue" /> Lightning Fast
               </span>
               <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                 <Target className="w-4 h-4 text-brand-blue" /> 5.0/5 Rating
               </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={800}>
            <div className="mt-16 w-full max-w-4xl mx-auto border-t border-white/5 pt-8">
              <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                <div className="flex animate-scroll w-max gap-12 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {partners.map((partner, index) => (
                     <span key={`p1-${index}`} className="text-xl font-bold font-display tracking-tight hover:text-white transition-colors cursor-default whitespace-nowrap">{partner}</span>
                  ))}
                  {partners.map((partner, index) => (
                     <span key={`p2-${index}`} className="text-xl font-bold font-display tracking-tight hover:text-white transition-colors cursor-default whitespace-nowrap">{partner}</span>
                  ))}
                  {partners.map((partner, index) => (
                     <span key={`p3-${index}`} className="text-xl font-bold font-display tracking-tight hover:text-white transition-colors cursor-default whitespace-nowrap">{partner}</span>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-32 px-6 bg-brand-black relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-800/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto relative">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4 block">💡 Funcionalidades</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Pensamento Estratégico <br/>
                Com Tecnologia
              </h2>
              <p className="text-white/70 text-xl max-w-2xl mx-auto">
                Nunca percas uma oportunidade, processo ou conexão importante.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] gap-6">
            
            {/* CARD 1 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-full">
              <RevealOnScroll delay={0} className="h-full">
                <TiltCard className="h-full relative overflow-hidden rounded-[24px] bg-[#131B27] border border-gray-600/30 group hover:border-gray-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(156,163,175,0.15)] flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#131B27_0%,#000000_100%)]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(156,163,175,0.1)_20deg,transparent_40deg)] animate-spin-slow pointer-events-none opacity-50" />
                  
                  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" preserveAspectRatio="none">
                    {[...Array(5)].map((_, i) => (
                      <line 
                        key={i}
                        x1="50%" y1="50%" 
                        x2={`${Math.random() * 100}%`} y2={`${Math.random() < 0.5 ? 0 : 100}%`}
                        stroke="url(#metallic-gradient)" 
                        strokeWidth="1"
                        className="stroke-dash-500 animate-[dash_1.5s_linear_infinite]"
                        style={{animationDelay: `${i * 0.3}s`}}
                      />
                    ))}
                  </svg>

                  <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                     <div className="w-16 h-16 rounded-2xl bg-gray-500/10 border border-gray-500/30 flex items-center justify-center text-gray-300 backdrop-blur-md mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <Rocket className="w-8 h-8" />
                     </div>
                     
                     <div className="mt-auto transform group-hover:translate-x-2 transition-transform duration-300">
                       <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">Velocidade de <br/>Implementação</h3>
                       <p className="text-lg text-white/70 max-w-md leading-relaxed">
                         Sincroniza instantaneamente as tuas ferramentas em todos os dispositivos.
                       </p>
                     </div>
                  </div>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 6 */}
            <div className="lg:col-start-3 lg:row-start-1 lg:col-span-1 lg:row-span-2 h-full">
              <RevealOnScroll delay={100} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 flex flex-col hover:border-gray-500/50 transition-colors relative overflow-hidden group">
                   <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   <div className="mb-auto">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-gray-500/20 transition-colors">
                       <FileText className="w-6 h-6" />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-2">Relatórios <br/>Automáticos</h3>
                     <p className="text-sm text-white/60 mb-6">
                       Partilha métricas e insights com um clique.
                     </p>
                     <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 origin-left transition-transform">97.8%</div>
                     <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Conversion Rate</div>
                   </div>

                   <div className="flex items-end justify-between h-32 gap-2 mt-8">
                      {[35, 60, 45, 80, 55, 90, 75].map((h, i) => (
                        <div key={i} className="w-full bg-gray-700/30 rounded-t-sm relative group/bar cursor-pointer overflow-hidden h-full flex items-end">
                          <div 
                            className="w-full bg-metallic transition-all duration-700 ease-out-expo group-hover:translate-y-0 translate-y-full group-hover:delay-[calc(var(--delay)*50ms)] animate-[draw-height_0.8s_ease-out_forwards]"
                            style={{ height: `${h}%`, '--delay': i, '--target-height': `${h}%`, animationDelay: `${0.5 + i * 0.1}s` } as React.CSSProperties} 
                          />
                        </div>
                      ))}
                   </div>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 2 */}
            <div className="lg:col-start-4 lg:row-start-1 col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={200} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 relative overflow-hidden group hover:border-gray-500/50 transition-colors">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(156,163,175,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="relative z-10 h-full flex flex-col justify-between">
                     <LinkIcon className="w-10 h-10 text-gray-300 mb-4 group-hover:rotate-45 transition-transform duration-300" />
                     <div>
                       <h3 className="text-xl font-bold text-white mb-2">Integrações</h3>
                       <p className="text-sm text-white/60">Cria uma rede de processos interligados.</p>
                     </div>
                   </div>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 3 */}
            <div className="lg:col-start-4 lg:row-start-2 col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={300} className="h-full">
                <TiltCard className="h-full bg-white rounded-[24px] p-8 relative group hover:-translate-y-1 transition-transform duration-300 shadow-xl">
                   <div className="h-full flex flex-col justify-between text-black">
                     <div className="flex justify-between items-start">
                       <Smartphone className="w-10 h-10 text-gray-600 group-hover:scale-110 transition-transform" />
                       <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold rounded-md uppercase tracking-wide group-hover:bg-gray-800 group-hover:text-white transition-colors">iOS & Android</span>
                     </div>
                     <div>
                       <h3 className="text-xl font-bold mb-2">App Mobile</h3>
                       <p className="text-sm text-gray-500">Gere vendas em movimento, online ou offline.</p>
                     </div>
                   </div>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 4 */}
            <div className="col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={400} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 group hover:border-gray-500/50 transition-colors">
                   <Lock className="w-10 h-10 text-gray-300 mb-4 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all" />
                   <h3 className="text-xl font-bold text-white mb-2">Segurança Total</h3>
                   <p className="text-sm text-white/60 mb-4">Apenas tu e a tua equipa acedem aos dados.</p>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 5 */}
            <div className="col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={500} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 group hover:border-gray-500/50 transition-colors relative overflow-hidden">
                   <Calendar className="w-10 h-10 text-gray-300 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="text-xl font-bold text-white mb-2">Calendário</h3>
                   <p className="text-sm text-white/60">Sincroniza reuniões e agendas automaticamente.</p>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 7 */}
            <div className="col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={600} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 group hover:border-gray-500/50 transition-colors">
                   <Camera className="w-10 h-10 text-gray-300 mb-4 group-hover:rotate-12 transition-transform" />
                   <h3 className="text-xl font-bold text-white mb-2">Captura de Leads</h3>
                   <p className="text-sm text-white/60 mb-4">Importa leads de múltiplas fontes.</p>
                </TiltCard>
              </RevealOnScroll>
            </div>

            {/* CARD 8 */}
            <div className="col-span-1 row-span-1 h-full">
              <RevealOnScroll delay={700} className="h-full">
                <TiltCard className="h-full bg-[#131B27] rounded-[24px] border border-gray-600/30 p-8 group hover:border-gray-500/50 transition-colors">
                   <Search className="w-10 h-10 text-gray-300 mb-4 group-hover:scale-110 transition-transform" />
                   <h3 className="text-xl font-bold text-white mb-2">Pesquisa Smart</h3>
                   <p className="text-sm text-white/60 mb-4">Encontra facilmente contactos e histórico.</p>
                </TiltCard>
              </RevealOnScroll>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="py-32 px-6 bg-brand-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <RevealOnScroll className="relative z-10">
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-15 pointer-events-none z-[-1]">
              <svg viewBox="0 0 200 200" className="w-full h-full stroke-gray-500 fill-none" strokeWidth="0.5">
                 <path d="M 0 100 Q 50 20 100 100 T 200 100" className="animate-[pulse_4s_infinite]" />
                 <path d="M 0 120 Q 50 40 100 120 T 200 120" opacity="0.6" className="animate-[pulse_4s_infinite_1s]" />
              </svg>
            </div>

            <div className="text-gray-400 text-4xl mb-6 animate-bounce">✦</div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight mb-8">
              Um Lugar Para Todas <br/>
              As Tuas <span className="relative inline-block">Necessidades<span className="absolute bottom-1 left-0 w-full h-1 bg-metallic rounded-full origin-left animate-[grow-width_2s_ease-out_forwards]"></span></span> <br/>
              De Vendas
            </h2>
            <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-lg">
              A forma mais inteligente de implementar, comprar, integrar e escalar os teus sistemas comerciais.
            </p>
            <button className="px-8 py-4 bg-metallic text-white font-bold rounded-xl hover:brightness-110 animate-glow transition-all duration-300 flex items-center gap-2 group relative overflow-hidden animate-pop-interval shadow-lg shadow-gray-500/20">
              <span className="relative z-10 flex items-center gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            </button>
          </RevealOnScroll>

          {/* Integration Hub */}
          <div className="relative h-[500px] flex flex-col items-center justify-center">
            <div className="relative w-full h-full max-w-[600px] scale-[0.85] md:scale-100 origin-center hover:scale-105 transition-transform duration-700 ease-out-expo">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-gray-500/10 border-2 border-gray-500 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(156,163,175,0.3)] animate-[pulse_2s_ease-in-out_infinite]">
                 <Cpu className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                 <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(156,163,175,0.4)_0%,transparent_70%)] animate-ping opacity-20" />
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 600 500">
                <defs>
                   <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                </defs>
                <path d="M 300 250 C 200 220, 40 200, 40 250" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '0s'}} />
                <path d="M 300 250 C 260 180, 140 100, 100 100" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '1s'}} />
                <path d="M 300 250 C 290 150, 250 50, 230 20" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '2s'}} />
                <path d="M 300 250 C 310 150, 350 50, 370 20" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '3s'}} />
                <path d="M 300 250 C 340 180, 460 100, 500 100" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '4s'}} />
                <path d="M 300 250 C 400 220, 560 200, 560 250" fill="none" stroke="url(#metallic-gradient)" strokeWidth="2" filter="url(#glow)" className="seq-line" style={{animationDelay: '5s'}} />
              </svg>

              {/* Platform Icons */}
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '6.7%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 4.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 15c-4.14 0-7.5-3.36-7.5-7.5S7.86 4.5 12 4.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z" opacity="0" />
                    <path d="M17.5 12a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0zm-5.5 0v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M7 6h5a4 4 0 0 1 4 4 4 4 0 0 1-4 4H7V6z M7 14h0v4" stroke="none" />
                    <path d="M8 7h4a3 3 0 0 1 3 3 3 3 0 0 1-3 3H8V7z m0 7v4" fill="currentColor"/>
                 </svg>
              </div>
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '16.7%', top: '20%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M12 5.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 12a3 3 0 100 6 3 3 0 000-6zm0 1.5l3.5-3.5M12 13.5l-3.5-3.5M12 13.5V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '38.3%', top: '4%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 16a6 6 0 116-6 6 6 0 01-6 6z" fillRule="evenodd"/>
                    <path d="M12 8a4 4 0 104 4 4 4 4 0 00-4-4z"/>
                 </svg>
              </div>
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '61.7%', top: '4%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-14 h-14 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M17.5 19c0 .28-.22.5-.5.5H6.5c-2.48 0-4.5-2.02-4.5-4.5 0-2.22 1.62-4.06 3.74-4.44C6.46 6.3 9.4 3.5 13 3.5c3.5 0 6.42 2.7 7.23 6.64C22.18 10.74 23.5 12.44 23.5 14.5c0 2.48-2.02 4.5-4.5 4.5-.28 0-.5-.22-.5-.5s.22-.5.5-.5c1.93 0 3.5-1.57 3.5-3.5 0-1.8-1.37-3.28-3.13-3.48-.27-.03-.48-.24-.52-.5C18.06 6.8 15.7 4.5 13 4.5c-3.23 0-5.94 2.37-6.42 5.56-.05.32-.32.54-.64.54h-.05C3.58 10.6 2 12.38 2 14.5c0 1.93 1.57 3.5 3.5 3.5.28 0 .5.22.5.5s-.22.5-.5.5h-.05" stroke="currentColor" strokeWidth="1"/>
                 </svg>
              </div>
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '83.3%', top: '20%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M21 5c-1.1 0-2 .9-2 2v10H5V7c0-1.1-.9-2-2-2S1 5.9 1 7v12h6V10h2v9h6V10h2v9h6V7c0-1.1-.9-2-2-2z"/>
                 </svg>
              </div>
              <div className="absolute z-20 hover:scale-125 transition-transform duration-300" style={{left: '93.3%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                 <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white hover:fill-gray-300 transition-colors drop-shadow-lg">
                    <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z"/>
                 </svg>
              </div>

            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full flex justify-center items-center gap-4 md:gap-8 z-20 whitespace-nowrap">
               <span className="flex items-center gap-2 px-2 py-1 text-sm text-white/70 hover:text-white hover:scale-105 transition-all cursor-default">
                 <div className="w-5 h-5 rounded-full bg-gray-500/10 flex items-center justify-center border border-gray-500/40 flex-shrink-0">
                   <CheckCircle2 className="w-3 h-3 text-gray-300" />
                 </div> 
                 Instant Sync
               </span>
               <span className="flex items-center gap-2 px-2 py-1 text-sm text-white/70 hover:text-white hover:scale-105 transition-all cursor-default">
                 <div className="w-5 h-5 rounded-full bg-gray-500/10 flex items-center justify-center border border-gray-500/40 flex-shrink-0">
                   <Shield className="w-3 h-3 text-gray-300" />
                 </div> 
                 Enterprise Security
               </span>
               <span className="flex items-center gap-2 px-2 py-1 text-sm text-white/70 hover:text-white hover:scale-105 transition-all cursor-default">
                 <div className="w-5 h-5 rounded-full bg-gray-500/10 flex items-center justify-center border border-gray-500/40 flex-shrink-0">
                   <Zap className="w-3 h-3 text-gray-300" />
                 </div> 
                 Real-time
               </span>
               <span className="flex items-center gap-2 px-2 py-1 text-sm text-white/70 hover:text-white hover:scale-105 transition-all cursor-default">
                 <div className="w-5 h-5 rounded-full bg-gray-500/10 flex items-center justify-center border border-gray-500/40 flex-shrink-0">
                   <Target className="w-3 h-3 text-gray-300" />
                 </div> 
                 One-click
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUTIONS SECTION */}
      <section id="solutions" className="py-32 px-6 bg-brand-black relative">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <span className="text-white/60 text-sm font-bold uppercase tracking-widest mb-4 block">SOLUÇÕES</span>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">As Nossas Soluções</h2>
              <p className="text-white/70 text-xl max-w-2xl mx-auto">Soluções completas para transformar o teu negócio.</p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RevealOnScroll delay={0}>
              <div className="group relative overflow-hidden rounded-[24px] bg-[#131B27] border border-gray-600/30 p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(156,163,175,0.2)] hover:border-gray-500 hover:-translate-y-2">
                <div className="absolute top-0 left-0 h-full w-1 bg-metallic opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-gray-300 group-hover:scale-110 transition-all duration-500">
                  <Search className="w-8 h-8" />
                </div>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-metallic mb-8 leading-none">
                  <CountUp end={1} prefix="0" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Diagnóstico e Estratégia</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Aliamos anos de experiência no mercado ao conhecimento prático para te ajudar a transformar a estratégia comercial e de gestão da tua empresa.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={100}>
              <div className="group relative overflow-hidden rounded-[24px] bg-[#131B27] border border-gray-600/30 p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(156,163,175,0.2)] hover:border-gray-500 hover:-translate-y-2">
                <div className="absolute top-0 left-0 h-full w-1 bg-metallic opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-gray-300 group-hover:scale-110 transition-all duration-500">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-metallic mb-8 leading-none">
                  <CountUp end={2} prefix="0" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">CRM & Vendas Inteligentes</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Implementamos soluções de CRM e Inteligência Artificial para transformar o teu negócio numa máquina previsível de vendas com dados e resultados em tempo real.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <div className="group relative overflow-hidden rounded-[24px] bg-[#131B27] border border-gray-600/30 p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(156,163,175,0.2)] hover:border-gray-500 hover:-translate-y-2">
                <div className="absolute top-0 left-0 h-full w-1 bg-metallic opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-gray-300 group-hover:scale-110 transition-all duration-500">
                  <Layout className="w-8 h-8" />
                </div>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-metallic mb-8 leading-none">
                  <CountUp end={3} prefix="0" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Gestão de Projetos & Produtividade</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Implementamos soluções de gestão de projetos e processos, para transformar a eficiência operacional do teu negócio.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="group relative overflow-hidden rounded-[24px] bg-[#131B27] border border-gray-600/30 p-12 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px_rgba(156,163,175,0.2)] hover:border-gray-500 hover:-translate-y-2">
                <div className="absolute top-0 left-0 h-full w-1 bg-metallic opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-8 right-8 text-white/20 group-hover:text-gray-300 group-hover:scale-110 transition-all duration-500">
                  <Workflow className="w-8 h-8" />
                </div>
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-metallic mb-8 leading-none">
                  <CountUp end={4} prefix="0" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">Integrações & Automação</h3>
                <p className="text-lg text-white/70 leading-relaxed">
                  Integramos as principais soluções de software do mercado para centralizar a informação e colocar todo o teu ecossistema tecnológico a comunicar. Automatizamos processos para garantir uma alta eficiência operacional.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 7. TEAM SECTION */}
      <section className="py-32 px-6 bg-brand-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
           <RevealOnScroll>
             <div className="mb-16">
              <h2 className="font-display text-4xl font-bold mb-4 text-white">A Nossa Equipa</h2>
              <p className="text-white/60 text-lg">Especialistas em transformação digital de vendas.</p>
            </div>
           </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sofia Martins", role: "CEO & Strategy Lead", seed: "Sofia" },
              { name: "Miguel Costa", role: "CRM Architect", seed: "Miguel" },
              { name: "Ana Silva", role: "Automation Expert", seed: "Ana" },
              { name: "Tiago Rocha", role: "Implementation", seed: "Tiago" },
              { name: "Mariana Santos", role: "Support Lead", seed: "Mariana" },
              { name: "Ricardo Alves", role: "Data Scientist", seed: "Ricardo" },
            ].map((member, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100}>
                <div className="group relative overflow-hidden rounded-xl bg-[#131B27] border border-white/5 hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20">
                  <div className="aspect-[4/3] bg-gradient-to-b from-gray-800 to-black relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gray-500/10 mix-blend-overlay" />
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}&backgroundColor=e5e7eb&backgroundType=gradientLinear`} 
                        alt={member.name}
                        className="w-40 h-40 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-zinc-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm duration-300">
                        <a href="#" className="p-3 bg-white rounded-full text-zinc-900 hover:scale-110 transition-transform shadow-lg">
                          <Linkedin className="w-6 h-6" />
                        </a>
                      </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gray-300 transition-colors">{member.name}</h3>
                    <p className="text-gray-400 text-sm font-medium">{member.role}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section id="contact" className="py-40 px-6 bg-brand-black relative overflow-hidden flex items-center justify-center">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-glow-radial blur-[60px] pointer-events-none animate-pulse-slow" />
         
         <RevealOnScroll className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
              Pronto Para <br/> Crescer?
            </h2>
            <p className="text-xl text-white/80 mb-12">
              Agenda uma consultoria gratuita de 30 minutos e descobre o potencial da tua empresa.
            </p>
            
            <div className="w-full md:w-auto flex justify-center animate-pop-interval">
              <MagneticButton onClick={() => {}} className="px-10 py-5 bg-metallic text-white text-lg font-bold rounded-full hover:brightness-110 animate-glow transition-all duration-300 flex items-center gap-3 mx-auto group relative overflow-hidden shadow-[0_0_20px_rgba(156,163,175,0.4)]">
                <span className="relative z-10 flex items-center gap-3">
                  Agendar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
              </MagneticButton>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/60">
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-300" /> Resposta em 24h</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-300" /> Sem compromisso</span>
               <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gray-300" /> Consultoria gratuita</span>
            </div>
         </RevealOnScroll>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-16 px-6 bg-brand-black border-t border-white/5 text-sm relative">
        <div className="absolute top-0 left-0 h-[1px] bg-metallic animate-[draw-width_1.2s_ease-out_forwards]" />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                 <img 
                   src="https://cdn.prod.website-files.com/6478bc682b0c0435582bea36/6929cce7d212c922e37aa97d_unlocking%20logo%20branco.png" 
                   alt="Unlocking Logo" 
                   className="h-10 w-auto object-contain"
                 />
              </div>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-gray-500/20 transition-colors transform hover:scale-110 duration-300">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-gray-500/20 transition-colors transform hover:scale-110 duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-gray-500/20 transition-colors transform hover:scale-110 duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 w-full lg:w-auto">
              {footerItems.map((item, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <a href="#" className="font-bold text-white hover:text-gray-300 transition-colors block mb-2">{item}</a>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40">
            <div>Designed by Distinct Agency © 2025 Unlocking Tech. All Rights Reserved</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms And Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
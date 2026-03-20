import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBuilding,
  FaBox,
  FaCalendarAlt,
  FaComments,
  FaArrowRight,
  FaChevronDown,
  FaBell,
  FaShieldAlt,
  FaUsers,
  FaCheck,
  FaHome,
} from 'react-icons/fa';

function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrolled;
}

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function LandingPage() {
  const headerScrolled = useScrollDirection();
  const featuresRef = useInView(0.08);
  const aboutRef = useInView(0.08);
  const ctaRef = useInView(0.08);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className='min-h-screen bg-gray-50' style={{ scrollBehavior: 'smooth' }}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          headerScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-6xl mx-auto flex justify-between items-center py-4 px-6 md:px-10'>
          <button
            onClick={() => scrollTo('hero')}
            className='flex items-center gap-3 focus:outline-none group'
          >
            <div className='flex size-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow'>
              <FaBuilding className='text-xl text-white' />
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${headerScrolled ? 'text-gray-900' : 'text-white'}`}>CondoSync</span>
          </button>
          <nav className='hidden md:flex items-center gap-10'>
            <button
              onClick={() => scrollTo('features')}
              className={`text-sm font-medium transition-colors ${headerScrolled ? 'text-gray-500 hover:text-blue-600' : 'text-white/70 hover:text-white'}`}
            >
              Serviços
            </button>
            <button
              onClick={() => scrollTo('about')}
              className={`text-sm font-medium transition-colors ${headerScrolled ? 'text-gray-500 hover:text-blue-600' : 'text-white/70 hover:text-white'}`}
            >
              Sobre
            </button>
            <button
              onClick={() => scrollTo('cta')}
              className={`text-sm font-medium transition-colors ${headerScrolled ? 'text-gray-500 hover:text-blue-600' : 'text-white/70 hover:text-white'}`}
            >
              Contato
            </button>
          </nav>
          <Link
            to='/login'
            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-200'
          >
            Entrar
          </Link>
        </div>
      </header>

      <section
        id='hero'
        className='relative min-h-screen flex flex-col justify-center px-6 md:px-16 pt-28 pb-32 overflow-hidden'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]' />
        <div className='absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl' />
        <div className='absolute -bottom-20 -left-40 w-[400px] h-[400px] rounded-full bg-blue-400/10 blur-3xl' />
        <div className='absolute inset-0 opacity-30' style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className='relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          <div>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8'>
              <span className='size-2 rounded-full bg-emerald-400 animate-pulse' />
              <span className='text-sm font-medium text-white/90'>Gestão condominial em um só lugar</span>
            </div>
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight'>
              Seu condomínio,
              <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200'>
                simplificado.
              </span>
            </h1>
            <p className='mt-8 text-lg md:text-xl text-blue-100/90 max-w-xl leading-relaxed'>
              Reclamações, reservas, encomendas e avisos. Interface moderna, segura e pensada para o dia a dia.
            </p>
            <div className='mt-12 flex flex-wrap gap-4'>
              <Link
                to='/cadastro'
                className='group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl shadow-2xl shadow-black/10 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-200'
              >
                Começar agora
                <FaArrowRight className='text-sm group-hover:translate-x-1 transition-transform' />
              </Link>
              <button
                onClick={() => scrollTo('features')}
                className='inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/25 hover:bg-white/20 hover:border-white/40 transition-all duration-200'
              >
                Ver serviços
              </button>
            </div>
          </div>

          <div
            className='hidden lg:block'
            style={{ perspective: '1200px' }}
          >
            <div
              className='rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-2xl shadow-black/20 overflow-hidden'
              style={{ transform: 'rotateY(-6deg) rotateX(2deg)' }}
            >
              <div className='flex items-center gap-2 px-4 py-3 bg-black/20 border-b border-white/10'>
                <span className='size-3 rounded-full bg-red-400/80' />
                <span className='size-3 rounded-full bg-yellow-400/80' />
                <span className='size-3 rounded-full bg-emerald-400/80' />
                <span className='ml-3 text-[11px] text-white/40 font-medium'>CondoSync — Dashboard</span>
              </div>
              <div className='flex'>
                <div className='w-14 shrink-0 bg-black/15 border-r border-white/10 py-4 flex flex-col items-center gap-4'>
                  <div className='size-7 rounded-lg bg-indigo-400/30 flex items-center justify-center'>
                    <FaBuilding className='text-white/60 text-[10px]' />
                  </div>
                  <div className='size-7 rounded-lg bg-white/10 flex items-center justify-center'>
                    <FaHome className='text-white/40 text-[10px]' />
                  </div>
                  <div className='size-7 rounded-lg bg-white/10 flex items-center justify-center'>
                    <FaCalendarAlt className='text-white/40 text-[10px]' />
                  </div>
                  <div className='size-7 rounded-lg bg-white/10 flex items-center justify-center'>
                    <FaBox className='text-white/40 text-[10px]' />
                  </div>
                  <div className='size-7 rounded-lg bg-white/10 flex items-center justify-center'>
                    <FaComments className='text-white/40 text-[10px]' />
                  </div>
                </div>
                <div className='flex-1 p-4 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='h-3 w-28 rounded bg-white/25' />
                      <div className='h-2 w-40 rounded bg-white/10 mt-2' />
                    </div>
                    <div className='size-8 rounded-full bg-white/10' />
                  </div>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='rounded-xl bg-white/10 border border-white/10 p-3'>
                      <div className='size-7 rounded-lg bg-orange-400/20 flex items-center justify-center mb-2'>
                        <FaComments className='text-orange-300 text-[9px]' />
                      </div>
                      <div className='h-4 w-8 rounded bg-white/30 mb-1' />
                      <div className='h-2 w-14 rounded bg-white/10' />
                    </div>
                    <div className='rounded-xl bg-white/10 border border-white/10 p-3'>
                      <div className='size-7 rounded-lg bg-emerald-400/20 flex items-center justify-center mb-2'>
                        <FaCalendarAlt className='text-emerald-300 text-[9px]' />
                      </div>
                      <div className='h-4 w-8 rounded bg-white/30 mb-1' />
                      <div className='h-2 w-14 rounded bg-white/10' />
                    </div>
                    <div className='rounded-xl bg-white/10 border border-white/10 p-3'>
                      <div className='size-7 rounded-lg bg-indigo-400/20 flex items-center justify-center mb-2'>
                        <FaBox className='text-indigo-300 text-[9px]' />
                      </div>
                      <div className='h-4 w-8 rounded bg-white/30 mb-1' />
                      <div className='h-2 w-14 rounded bg-white/10' />
                    </div>
                  </div>
                  <div className='rounded-xl bg-white/10 border border-white/10 p-3'>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='h-3 w-20 rounded bg-white/20' />
                      <div className='h-2 w-12 rounded bg-white/10' />
                    </div>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <div className='size-6 rounded-lg bg-white/10' />
                        <div className='flex-1'>
                          <div className='h-2 w-full rounded bg-white/15' />
                          <div className='h-2 w-2/3 rounded bg-white/8 mt-1' />
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='size-6 rounded-lg bg-white/10' />
                        <div className='flex-1'>
                          <div className='h-2 w-full rounded bg-white/15' />
                          <div className='h-2 w-1/2 rounded bg-white/8 mt-1' />
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='size-6 rounded-lg bg-white/10' />
                        <div className='flex-1'>
                          <div className='h-2 w-3/4 rounded bg-white/15' />
                          <div className='h-2 w-1/3 rounded bg-white/8 mt-1' />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/60'>
          <span className='text-xs font-medium uppercase tracking-[0.2em]'>Role para explorar</span>
          <FaChevronDown className='text-xl animate-bounce' />
        </div>
      </section>

      <section
        id='features'
        ref={featuresRef.ref}
        className={`relative px-6 md:px-16 py-28 md:py-36 transition-all duration-700 ease-out ${
          featuresRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className='max-w-6xl mx-auto'>
          <div className='text-center max-w-2xl mx-auto mb-16'>
            <p className='text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4'>
              Serviços
            </p>
            <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4'>
              Tudo que seu condomínio precisa
            </h2>
            <p className='text-lg text-gray-500'>
              Ferramentas para moradores e administradores. Simples, integrado e seguro.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                icon: FaComments,
                title: 'Reclamações',
                desc: 'Registre e acompanhe ocorrências com opção de envio anônimo.',
                bg: 'bg-orange-50',
                iconBg: 'bg-orange-500',
                border: 'border-orange-100',
                accent: 'group-hover:shadow-orange-500/10',
              },
              {
                icon: FaCalendarAlt,
                title: 'Reserva de espaços',
                desc: 'Agende salões e áreas comuns com calendário visual e confirmação na hora.',
                bg: 'bg-blue-50',
                iconBg: 'bg-blue-500',
                border: 'border-blue-100',
                accent: 'group-hover:shadow-blue-500/10',
              },
              {
                icon: FaBox,
                title: 'Encomendas',
                desc: 'Controle de entregas, notificações e histórico com filtros por data.',
                bg: 'bg-emerald-50',
                iconBg: 'bg-emerald-500',
                border: 'border-emerald-100',
                accent: 'group-hover:shadow-emerald-500/10',
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`group relative bg-white rounded-3xl border-2 ${item.border} p-8 shadow-sm hover:shadow-xl ${item.accent} hover:-translate-y-2 transition-all duration-300`}
              >
                <div className={`flex size-14 items-center justify-center rounded-2xl ${item.iconBg} text-white shadow-lg mb-6`}>
                  <item.icon className='text-xl' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>{item.title}</h3>
                <p className='text-gray-600 leading-relaxed'>{item.desc}</p>
                <div className='mt-6 flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors'>
                  <FaCheck className='text-blue-500 text-xs' />
                  Incluído no CondoSync
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id='about'
        ref={aboutRef.ref}
        className={`relative px-6 md:px-16 py-28 md:py-36 bg-white transition-all duration-700 ease-out ${
          aboutRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className='absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent' />
        <div className='relative max-w-4xl mx-auto text-center'>
          <p className='text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4'>
            Sobre
          </p>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Feito para a vida em condomínio
          </h2>
          <p className='text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto mb-14'>
            O CondoSync conecta moradores, síndicos e funcionários em uma única plataforma. Avisos em tempo real, reclamações organizadas e reservas sem conflito.
          </p>
          <div className='flex flex-wrap justify-center gap-12'>
            <div className='flex flex-col items-center gap-3'>
              <div className='flex size-14 items-center justify-center rounded-2xl bg-blue-50'>
                <FaBell className='text-2xl text-blue-500' />
              </div>
              <span className='text-sm font-semibold text-gray-700'>Avisos centralizados</span>
            </div>
            <div className='flex flex-col items-center gap-3'>
              <div className='flex size-14 items-center justify-center rounded-2xl bg-emerald-50'>
                <FaShieldAlt className='text-2xl text-emerald-500' />
              </div>
              <span className='text-sm font-semibold text-gray-700'>Dados protegidos</span>
            </div>
            <div className='flex flex-col items-center gap-3'>
              <div className='flex size-14 items-center justify-center rounded-2xl bg-orange-50'>
                <FaUsers className='text-2xl text-orange-500' />
              </div>
              <span className='text-sm font-semibold text-gray-700'>Moradores e funcionários</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id='cta'
        ref={ctaRef.ref}
        className={`relative px-6 md:px-16 py-28 md:py-36 transition-all duration-700 ease-out ${
          ctaRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800' />
        <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.08),transparent)]' />
        <div className='relative max-w-2xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight'>
            Pronto para simplificar?
          </h2>
          <p className='text-blue-100/90 text-lg mb-12'>
            Fale conosco ou crie sua conta e veja o CondoSync em ação.
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <a
              href='https://wa.me/5561982704201?text=Gostaria%20de%20esclarecer%20minhas%20dúvidas%20sobre%20o%20CondoSync.'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2.5 px-8 py-4 bg-white text-emerald-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200'
            >
              Fale conosco (WhatsApp)
            </a>
            <Link
              to='/cadastro'
              className='inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-200'
            >
              Criar conta
              <FaArrowRight className='text-sm' />
            </Link>
          </div>
        </div>
      </section>

      <footer className='bg-gray-900 text-gray-400 py-10 px-6'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-xl bg-blue-600'>
              <FaBuilding className='text-lg text-white' />
            </div>
            <span className='font-bold text-white text-lg'>CondoSync</span>
          </div>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} CondoSync. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

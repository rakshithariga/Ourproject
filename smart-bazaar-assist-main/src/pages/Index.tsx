import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Clock, ShoppingBag, Mic, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import BillingCounterStatus from '@/components/BillingCounterStatus';
import FamilySyncMode from '@/components/FamilySyncMode';
import FindHelpButton from '@/components/FindHelpButton';

const Index = () => {
  const { t } = useLanguage();

  const features = [{
    icon: Zap,
    titleKey: 'noQueues' as const,
    descKey: 'noQueuesDesc' as const,
    color: 'from-bazaar-mint to-primary'
  }, {
    icon: Clock,
    titleKey: 'fasterCheckout' as const,
    descKey: 'fasterCheckoutDesc' as const,
    color: 'from-bazaar-peach to-bazaar-coral'
  }, {
    icon: ShoppingBag,
    titleKey: 'smartCart' as const,
    descKey: 'smartCartDesc' as const,
    color: 'from-bazaar-lavender to-accent-foreground'
  }];

  return <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Photorealistic Background */}
      <section className="relative pt-32 pb-20 px-4 min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1920&q=80')`,
        filter: 'blur(3px)'
      }} />
        
        {/* Gradient Overlay - Left to Right Dark */}
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(to right, rgba(30, 30, 30, 0.92), rgba(30, 30, 30, 0.7), rgba(30, 30, 30, 0.3), transparent)'
      }} />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-left max-w-2xl">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2
          }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium text-white">
                {t.theFutureOfGroceryShopping}
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t.welcomeTo}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-bazaar-mint to-primary">{t.smartBazaar}</span>
              <br />
              {t.assistant}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-10">
              {t.heroSubheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button variant="hero" size="xl">
                  {t.startShopping}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Mic className="w-5 h-5 mr-2" />
                {t.voiceSearch}
              </Button>
            </div>

            {/* AI Search Hint */}
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.8
          }} className="mt-8 flex items-center gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                <span>{t.voiceSearch}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/60" />
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                <span>{t.imageSearch}</span>
              </div>
            </motion.div>

            {/* Quick Actions - Family Sync & Find Help */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              <FamilySyncMode />
              <FindHelpButton />
            </motion.div>
          </motion.div>
        </div>

        {/* Billing Counter Status - Compact View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <BillingCounterStatus compact />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.whyChooseSmartBazaar}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.revolutionizingExperience}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => <motion.div key={feature.titleKey} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5,
            delay: index * 0.1
          }}>
                <Card variant="feature" className="h-full p-8 group hover:shadow-elevated transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-primary-foreground" />
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {t[feature.titleKey]}
                    </h3>
                    <p className="text-muted-foreground">
                      {t[feature.descKey]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{
            value: '500+',
            labelKey: 'productsCount' as const
          }, {
            value: '60s',
            labelKey: 'avgCheckout' as const
          }, {
            value: '99%',
            labelKey: 'satisfaction' as const
          }, {
            value: '24/7',
            labelKey: 'support' as const
          }].map((stat, index) => <motion.div key={stat.labelKey} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{t[stat.labelKey]}</div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">{t.copyright}</p>
        </div>
      </footer>
    </div>;
};
export default Index;
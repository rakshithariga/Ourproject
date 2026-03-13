import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-8 px-4 border-t border-border mt-auto">
      <div className="container mx-auto max-w-6xl text-center">
        <p className="text-sm text-muted-foreground">{t.copyright}</p>
        <p className="text-xs text-muted-foreground mt-2">
          Built with ❤️ by <span className="font-semibold text-foreground">shashank M M, Aniketh H M, Rakshith</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

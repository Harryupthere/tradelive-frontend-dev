import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./translator.scss";

// Add interface for Google Translate API
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

interface TranslatorProps {
  className?: string;
}

const Translator: React.FC<TranslatorProps> = ({ className }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showTranslator, setShowTranslator] = useState<boolean>(false);
  let IsLoaded = false;

  const googleTranslateElementInit = (): void => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: 'af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh-CN,zh-TW,co,hr,cs,da,nl,en,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,ko,kk,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu',
        autoDisplay: false
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    if (!IsLoaded) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
      IsLoaded = true;
    }
  }, []);

  const toggleTranslator = (): void => {
    setShowTranslator(!showTranslator);
  };

  return (
    <>
      <div id="google_translate_element" className={className || ""}></div>
      {/* {showTranslator ? (
        <div id="google_translate_element" className=""></div>
      ) : (
        <Button variant="primary" className="px-4" onClick={toggleTranslator}>
          Language
        </Button>
      )} */}
    </>
  );
};

export default Translator;

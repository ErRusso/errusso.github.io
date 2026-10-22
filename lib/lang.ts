/**
 * Pre-paint language-switch entrance.
 *
 * Hard-load fallback for the language switch (e.g. a direct link or a router
 * fallback to a full document load). The outgoing animation saves the target
 * language in sessionStorage; this script runs before the new page paints,
 * sets the attributes that drive the panel/page entrance, then clears them.
 * Without it the new page would flash fully rendered before React mounts.
 */
const langInit = `(function(){try{
  var raw=sessionStorage.getItem("portfolio:lang-enter");
  if(!raw)return;
  sessionStorage.removeItem("portfolio:lang-enter");
  var data=JSON.parse(raw);
  var root=document.documentElement;
  root.dataset.langEnter="";
  root.dataset.langTarget=data.label||"";
  root.style.setProperty("--lang-dir",String(data.dir||1));
  setTimeout(function(){delete root.dataset.langEnter;delete root.dataset.langTarget;},700);
}catch(e){}})();`;

export const langInitScriptId = "lang-init";

export default langInit;

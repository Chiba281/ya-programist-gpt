// Draw vector accents with CSS, rather than the unsupported combining glyph U+20D7.
function fixVectorNotation(rootNode){
 const walker=document.createTreeWalker(rootNode,NodeFilter.SHOW_TEXT), nodes=[];let n;
 while(n=walker.nextNode())if(n.data.includes('\u20d7')&&!n.parentElement.closest('.vector-glyph,script,style,textarea,option,svg'))nodes.push(n);
 for(const node of nodes){
  let text=node.data.replace(/d\u20d7([A-Za-zΑ-ω])/g,'d$1\u20d7').replace(/×\u20d7([A-Za-zΑ-ω])/g,'×$1\u20d7').replace(/([A-Za-zΑ-ω])([′₀-₉]+)\u20d7/g,'$1\u20d7$2');
  const re=/([A-Za-zΑ-ω0-9])\u20d7/g, fragment=document.createDocumentFragment();let m,last=0;
  while(m=re.exec(text)){fragment.append(document.createTextNode(text.slice(last,m.index).replace(/\u20d7/g,'')));const v=document.createElement('span');v.className='vector-glyph';v.textContent=m[1];v.setAttribute('aria-label','вектор '+m[1]);fragment.append(v);last=re.lastIndex;}
  fragment.append(document.createTextNode(text.slice(last).replace(/\u20d7/g,'')));node.replaceWith(fragment);
 }
}
const vectorObserver=new MutationObserver(()=>fixVectorNotation(app));vectorObserver.observe(app,{subtree:true,childList:true,characterData:true});fixVectorNotation(app);

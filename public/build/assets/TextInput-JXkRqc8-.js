import{j as n,r as e}from"./app-Dd9Pe0d9.js";function y({value:s,className:t="",children:a,...r}){return n.jsx("label",{...r,className:"block mb-1 text-sm font-semibold text-primary-800 dark:text-secondary-200 "+t,children:s||a})}const m=e.forwardRef(function({type:t="text",className:a="",isFocused:r=!1,...c},d){const o=e.useRef(null);return e.useImperativeHandle(d,()=>({focus:()=>o.current?.focus()})),e.useEffect(()=>{r&&o.current?.focus()},[r]),n.jsx("input",{...c,type:t,className:`
                border rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 transition duration-200 ease-in-out 
                bg-secondary-50 text-secondary-900 border-secondary-300 focus:border-primary-600 focus:ring-primary-500 placeholder-secondary-400 
                dark:bg-secondary-700 dark:text-secondary-100 dark:border-secondary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 dark:placeholder-secondary-300 
                ${a}
            `.trim(),ref:o})});export{y as I,m as T};

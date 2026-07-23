import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useThemeSwitcher = () : [
    string, 
    Dispatch<SetStateAction<string>>
]  => {
   const preferDarkQuery = '(prefers-color-scheme: dark)';
   const [darkMode, setDarkMode] = useState('dark');
   const getClassList = document.documentElement.classList;

   useEffect(() => {
      const mediaQuery = window.matchMedia(preferDarkQuery);
      const userPref = window.localStorage.getItem('theme');

      const handleChange = () => {
         if (userPref) {
            const check = userPref === 'dark' ? 'dark' : 'light';
            setDarkMode(check);

            if (check === 'dark') {
                getClassList.add('dark');
            } else {
                getClassList.remove('dark');
            }
         } else {
            const check = mediaQuery.matches ? 'dark' : 'light';
            setDarkMode(check);
            window.localStorage.setItem('theme', check);

            if (check === 'dark') {
               getClassList.add('dark');
            } else {
               getClassList.remove('dark');
            }
         }
      };

      handleChange();
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
   }, [getClassList]);

   useEffect(() => {
      if (darkMode === 'dark') {
         window.localStorage.setItem('theme', 'dark');
         getClassList.add('dark');
      }
      if (darkMode === 'light') {
         window.localStorage.setItem('theme', 'light');
         getClassList.remove('dark');
      }
   }, [darkMode, getClassList]);

   return [darkMode, setDarkMode];
};

"use client";

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { gsap, Expo } from "gsap";
import { AppContainer, Loading, Follow, ProgressBar, Content } from "./styled";

interface SetStateLoading {
    setLoading: Dispatch<SetStateAction<boolean>>
}

export function IntroduceLoad ({ 
    setLoading 
}: SetStateLoading) {
  const [counter, setCounter] = useState(0);
  const reveal = useCallback(async () => {
    const t1 =  gsap.timeline({});

      await t1
      .to(".follow", {
        width: "100%",
        ease: Expo.easeInOut,
        duration: 1.2,
        delay: 0.5,
      })
      .to(".hide", { opacity: 0, duration: 0.3 })
      .to(".follow", {
        height: "100%",
        ease: Expo.easeInOut,
        duration: 0.7,
      })
      .to(".content", { width: "100%", ease: Expo.easeInOut, duration: 0.7 });
    if (!t1.isActive()) {
       setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    const count = setInterval(() => {
      setCounter((counter: number) => {
        if(counter < 100) {
            return counter + 1
        } else {
            clearInterval(count);
            setCounter(100);
            reveal();
            return counter;
        }
      });
    }, 25);
    return () => clearInterval(count);
  }, [reveal]);



  return (
    <AppContainer>
      <Loading>
        <Follow className="follow"></Follow>
        <ProgressBar
          className="hide"
          id="progress-bar"
          style={{ width: counter + "%" }}
        ></ProgressBar>
        
      </Loading>
      
      <Content className="content">
      <div className="w-full h-full flex justify-center items-center text-3xl">
        WELCOME
        </div>
      </Content>
    </AppContainer>
  );
};
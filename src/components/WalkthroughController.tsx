import React, { useEffect, useRef } from 'react';
import { useWalkthroughStore } from '@/store/walkthroughStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useWalkthroughUIStore } from '@/store/zustandStores';

const driverObj = driver({
  allowClose: false,
  animate: true,
  nextBtnText: 'Next',
  prevBtnText: 'Back',
  doneBtnText: 'Done',
  allowKeyboardControl: true,
});

export const WalkthroughController: React.FC = () => {
  const { steps, currentStep, isActive, next, back, skip, complete, trainingInstanceId } = useWalkthroughStore();
  const location = useLocation();
  const navigate = useNavigate();
  const prevStep = useRef<number>(-1);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastInstanceIdRef = useRef<number>(trainingInstanceId);

  useEffect(() => {
    // Cleanup polling on unmount or effect rerun
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      driverObj.destroy();
    };
  }, []);

  useEffect(() => {
    // Always clear polling before starting new one
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
    driverObj.destroy();

    if (!isActive || steps.length === 0) {
      return;
    }

    const step = steps[currentStep];
    if (!step) return;

    lastInstanceIdRef.current = trainingInstanceId;

    console.log('[Walkthrough Debug] Current step:', currentStep, step.selector, 'isActive:', isActive, 'pathname:', location.pathname);

    // Only proceed if we're on the correct page
    if (step.page && step.page !== location.pathname) {
      console.log('[Walkthrough Debug] Not on correct page, navigating to:', step.page, 'Current:', location.pathname);
      navigate(step.page);
      // Do NOT start polling for the selector until the page is correct
      return;
    }

    // Only start polling for the selector when the page is correct
    const showStep = () => {
      // Defensive: Only continue if instanceId and step are still current
      if (!isActive || steps.length === 0 || lastInstanceIdRef.current !== trainingInstanceId) {
        return;
      }
      const el = document.querySelector(step.selector);
      console.log('[Walkthrough Debug] Looking for selector:', step.selector, 'Found:', !!el, 'On page:', location.pathname);
      if (el) {
        setTimeout(() => {
          console.log('[Walkthrough Debug] showStep: highlighting selector:', step.selector);
          driverObj.highlight({
            element: step.selector,
            ...(step.stageRadius !== undefined ? { stageRadius: step.stageRadius } : {}),
            ...(step.stagePadding !== undefined ? { stagePadding: step.stagePadding } : {}),
            popover: {
              title: '',
              description: typeof step.content === 'string' ? step.content : '',
              side: step.placement || 'bottom',
              align: step.align || 'start', // Pass align to driver.js
              popoverClass: 'driverjs-custom-popover',
              onPopoverRender: (popover) => {
                if (popover.description) {
                  popover.description.onclick = null;
                  if (!step.advanceOn || step.advanceOn === 'both' || step.advanceOn === 'description') {
                    popover.description.style.cursor = "pointer";
                    popover.description.onclick = () => {
                      if (step.setCategory) {
                        useWalkthroughUIStore.getState().setSelectedCategory(step.setCategory);
                      }
                      const win = window as Window & typeof globalThis & { handleSelectTable?: () => void, handleRightPanelClick?: () => void };
                      if (step.selector === ".select-table-prompt" && typeof win.handleRightPanelClick === 'function') {
                        win.handleRightPanelClick();
                        useWalkthroughStore.getState().next();
                      } else if (step.selector === ".select-table" && typeof win.handleSelectTable === 'function') {
                        win.handleSelectTable();
                      } else if (step.selector === ".table-btn") {
                        navigate("/table");
                        useWalkthroughStore.getState().next(); // Advance to next step after navigating
                      } else {
                        useWalkthroughStore.getState().next();
                      }
                    };
                  } else {
                    popover.description.style.cursor = "default";
                  }
                }
              }
            }
          });
        }, 100);
      } else {
        pollingTimeoutRef.current = setTimeout(showStep, 100);
      }
    };

    showStep();
    prevStep.current = currentStep;

    // Cleanup polling on effect rerun
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      driverObj.destroy();
    };
  }, [steps, currentStep, isActive, location.pathname, next, back, skip, complete, navigate, trainingInstanceId]);

  useEffect(() => {
    if (!isActive || steps.length === 0) return;
    const step = steps[currentStep];
    if (step && step.onAdvance === 'autoCloseAndNavigateHome') {
      setTimeout(() => {
        useWalkthroughStore.getState().complete();
        navigate('/');
      }, 2000);
    }
  }, [steps, currentStep, isActive, navigate]);

  return null;
};
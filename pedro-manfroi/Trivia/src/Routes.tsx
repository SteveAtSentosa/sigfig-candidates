/**
 * Renders all the application routes.
 */
import React, { FC } from 'react';
import { Home } from './components/home/Home';
import { Quiz } from './components/quiz/Quiz';
import Settings from './components/settings/Settings';
import NotFoundPage from './components/home/NotFoundPage';
import { Theming } from './components/theming/Theming';
import { Route } from 'react-router-dom';
import { BrowserRouter, Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./transitions.css";

interface RoutesProps {
    children: React.ReactNode
}
  
  
export default function Routes() {  
    return (
        <BrowserRouter>
          <SwitchWithTransitionEffect>
            <Route exact path="/" component={Home} />,
            <Route exact path="/quiz" component={Quiz} />,
            <Route exact path="/settings" component={Settings} /> ,
            <Route exact path="/theming" component={Theming} /> ,
            <Route component={NotFoundPage} /> {/* Fallback route to redirect to the 404 - NotFoundPage */}
          </SwitchWithTransitionEffect>
        </BrowserRouter>
    )
}

/**
 * Add custom CSS Transition effects when navigating through routes.
 */
const SwitchWithTransitionEffect: FC<RoutesProps> = ({children}) => {
    const location = useLocation();
    return (
      <TransitionGroup>
        <CSSTransition key={location.key} timeout={500} classNames='slide'>
          <Switch location={location}>
            { children }
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    )
  };
  
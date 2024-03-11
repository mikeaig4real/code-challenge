import React from 'react';
import { Texts } from '../infra/constants';
import { Communities } from './Communities';

export const App = () => (
    <div className="container">
    <h1 className="center">{ Texts.HOME_TITLE }</h1>
    <Communities />
    </div>
  );

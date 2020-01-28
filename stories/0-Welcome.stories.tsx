import React from 'react';
import { Loading } from '@';

export default {
  title: 'Welcome',
};

export const toStorybook = () => <Loading />;

toStorybook.story = {
  name: 'to Storybook',
};

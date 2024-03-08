import TextMiddleDirective from './src/directive';

TextMiddleDirective.install = function (app) {
  app.directive('textMiddleEllipsis', TextMiddleDirective);
};

export default TextMiddleDirective;

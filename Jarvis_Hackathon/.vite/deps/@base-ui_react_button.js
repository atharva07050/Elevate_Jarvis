import {
  useButton,
  useRenderElement
} from "./chunk-U3H764IC.js";
import {
  require_react
} from "./chunk-E3EC3WKU.js";
import {
  __toESM
} from "./chunk-SNAQBZPT.js";

// node_modules/@base-ui/react/esm/button/Button.js
var React = __toESM(require_react(), 1);
var Button = React.forwardRef(function Button2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled = false,
    focusableWhenDisabled = false,
    nativeButton = true,
    style,
    ...elementProps
  } = componentProps;
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    focusableWhenDisabled,
    native: nativeButton
  });
  const state = {
    disabled
  };
  return useRenderElement("button", componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [elementProps, getButtonProps]
  });
});
if (true) Button.displayName = "Button";
export {
  Button
};
//# sourceMappingURL=@base-ui_react_button.js.map

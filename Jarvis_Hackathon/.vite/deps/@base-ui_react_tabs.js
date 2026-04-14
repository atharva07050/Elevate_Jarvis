import {
  CompositeRootContext,
  EMPTY_ARRAY,
  EMPTY_OBJECT,
  NOOP,
  SafeReact,
  error,
  getComputedStyle as getComputedStyle2,
  isHTMLElement,
  isReactVersionAtLeast,
  isShadowRoot,
  useButton,
  useCompositeRootContext,
  useIsoLayoutEffect,
  useMergedRefs,
  useRefWithInit,
  useRenderElement,
  useStableCallback
} from "./chunk-U3H764IC.js";
import {
  require_shim
} from "./chunk-JI6ZJWXA.js";
import {
  require_react_dom
} from "./chunk-SGT5QRRY.js";
import {
  require_jsx_runtime
} from "./chunk-FJAVJ7OA.js";
import {
  require_react
} from "./chunk-E3EC3WKU.js";
import {
  __export,
  __publicField,
  __toESM
} from "./chunk-SNAQBZPT.js";

// node_modules/@base-ui/react/esm/tabs/index.parts.js
var index_parts_exports = {};
__export(index_parts_exports, {
  Indicator: () => TabsIndicator,
  List: () => TabsList,
  Panel: () => TabsPanel,
  Root: () => TabsRoot,
  Tab: () => TabsTab
});

// node_modules/@base-ui/react/esm/tabs/root/TabsRoot.js
var React5 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useControlled.js
var React = __toESM(require_react());
function useControlled({
  controlled,
  default: defaultProp,
  name,
  state = "value"
}) {
  const {
    current: isControlled
  } = React.useRef(controlled !== void 0);
  const [valueState, setValue] = React.useState(defaultProp);
  const value = isControlled ? controlled : valueState;
  if (true) {
    React.useEffect(() => {
      if (isControlled !== (controlled !== void 0)) {
        error([`A component is changing the ${isControlled ? "" : "un"}controlled ${state} state of ${name} to be ${isControlled ? "un" : ""}controlled.`, "Elements should not switch from uncontrolled to controlled (or vice versa).", `Decide between using a controlled or uncontrolled ${name} element for the lifetime of the component.`, "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.", "More info: https://fb.me/react-controlled-components"].join("\n"));
      }
    }, [state, name, controlled]);
    const {
      current: defaultValue
    } = React.useRef(defaultProp);
    React.useEffect(() => {
      if (!isControlled && serializeToDevModeString(defaultValue) !== serializeToDevModeString(defaultProp)) {
        error([`A component is changing the default ${state} state of an uncontrolled ${name} after being initialized. To suppress this warning opt to use a controlled ${name}.`].join("\n"));
      }
    }, [defaultProp]);
  }
  const setValueIfUncontrolled = React.useCallback((newValue) => {
    if (!isControlled) {
      setValue(newValue);
    }
  }, []);
  return [value, setValueIfUncontrolled];
}
function serializeToDevModeString(input) {
  let nextId = 0;
  const seen = /* @__PURE__ */ new WeakMap();
  try {
    const result = JSON.stringify(input, function replacer(key, value) {
      if (key === "_owner" && this != null && typeof this === "object" && "$$typeof" in this) {
        return void 0;
      }
      if (typeof value === "bigint") {
        return `__bigint__:${value}`;
      }
      if (value !== null && typeof value === "object") {
        const id = seen.get(value);
        if (id !== void 0) {
          return `__object__:${id}`;
        }
        seen.set(value, nextId);
        nextId += 1;
      }
      return value;
    });
    return result ?? `__top__:${typeof input}`;
  } catch {
    return "__unserializable__";
  }
}

// node_modules/@base-ui/react/esm/composite/list/CompositeList.js
var React3 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/composite/list/CompositeListContext.js
var React2 = __toESM(require_react(), 1);
var CompositeListContext = React2.createContext({
  register: () => {
  },
  unregister: () => {
  },
  subscribeMapChange: () => {
    return () => {
    };
  },
  elementsRef: {
    current: []
  },
  nextIndexRef: {
    current: 0
  }
});
if (true) CompositeListContext.displayName = "CompositeListContext";
function useCompositeListContext() {
  return React2.useContext(CompositeListContext);
}

// node_modules/@base-ui/react/esm/composite/list/CompositeList.js
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function CompositeList(props) {
  const {
    children,
    elementsRef,
    labelsRef,
    onMapChange: onMapChangeProp
  } = props;
  const onMapChange = useStableCallback(onMapChangeProp);
  const nextIndexRef = React3.useRef(0);
  const listeners = useRefWithInit(createListeners).current;
  const map = useRefWithInit(createMap).current;
  const [mapTick, setMapTick] = React3.useState(0);
  const lastTickRef = React3.useRef(mapTick);
  const register = useStableCallback((node, metadata) => {
    map.set(node, metadata ?? null);
    lastTickRef.current += 1;
    setMapTick(lastTickRef.current);
  });
  const unregister = useStableCallback((node) => {
    map.delete(node);
    lastTickRef.current += 1;
    setMapTick(lastTickRef.current);
  });
  const sortedMap = React3.useMemo(() => {
    disableEslintWarning(mapTick);
    const newMap = /* @__PURE__ */ new Map();
    const sortedNodes = Array.from(map.keys()).filter((node) => node.isConnected).sort(sortByDocumentPosition);
    sortedNodes.forEach((node, index) => {
      const metadata = map.get(node) ?? {};
      newMap.set(node, {
        ...metadata,
        index
      });
    });
    return newMap;
  }, [map, mapTick]);
  useIsoLayoutEffect(() => {
    if (typeof MutationObserver !== "function" || sortedMap.size === 0) {
      return void 0;
    }
    const mutationObserver = new MutationObserver((entries) => {
      const diff = /* @__PURE__ */ new Set();
      const updateDiff = (node) => diff.has(node) ? diff.delete(node) : diff.add(node);
      entries.forEach((entry) => {
        entry.removedNodes.forEach(updateDiff);
        entry.addedNodes.forEach(updateDiff);
      });
      if (diff.size === 0) {
        lastTickRef.current += 1;
        setMapTick(lastTickRef.current);
      }
    });
    sortedMap.forEach((_, node) => {
      if (node.parentElement) {
        mutationObserver.observe(node.parentElement, {
          childList: true
        });
      }
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [sortedMap]);
  useIsoLayoutEffect(() => {
    const shouldUpdateLengths = lastTickRef.current === mapTick;
    if (shouldUpdateLengths) {
      if (elementsRef.current.length !== sortedMap.size) {
        elementsRef.current.length = sortedMap.size;
      }
      if (labelsRef && labelsRef.current.length !== sortedMap.size) {
        labelsRef.current.length = sortedMap.size;
      }
      nextIndexRef.current = sortedMap.size;
    }
    onMapChange(sortedMap);
  }, [onMapChange, sortedMap, elementsRef, labelsRef, mapTick]);
  useIsoLayoutEffect(() => {
    return () => {
      elementsRef.current = [];
    };
  }, [elementsRef]);
  useIsoLayoutEffect(() => {
    return () => {
      if (labelsRef) {
        labelsRef.current = [];
      }
    };
  }, [labelsRef]);
  const subscribeMapChange = useStableCallback((fn) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  });
  useIsoLayoutEffect(() => {
    listeners.forEach((l) => l(sortedMap));
  }, [listeners, sortedMap]);
  const contextValue = React3.useMemo(() => ({
    register,
    unregister,
    subscribeMapChange,
    elementsRef,
    labelsRef,
    nextIndexRef
  }), [register, unregister, subscribeMapChange, elementsRef, labelsRef, nextIndexRef]);
  return (0, import_jsx_runtime.jsx)(CompositeListContext.Provider, {
    value: contextValue,
    children
  });
}
function createMap() {
  return /* @__PURE__ */ new Map();
}
function createListeners() {
  return /* @__PURE__ */ new Set();
}
function sortByDocumentPosition(a, b) {
  const position = a.compareDocumentPosition(b);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
}
function disableEslintWarning(_) {
}

// node_modules/@base-ui/react/esm/tabs/root/TabsRootContext.js
var React4 = __toESM(require_react(), 1);
var TabsRootContext = React4.createContext(void 0);
if (true) TabsRootContext.displayName = "TabsRootContext";
function useTabsRootContext() {
  const context = React4.useContext(TabsRootContext);
  if (context === void 0) {
    throw new Error(true ? "Base UI: TabsRootContext is missing. Tabs parts must be placed within <Tabs.Root>." : formatErrorMessage_default(64));
  }
  return context;
}

// node_modules/@base-ui/react/esm/tabs/root/TabsRootDataAttributes.js
var TabsRootDataAttributes = (function(TabsRootDataAttributes2) {
  TabsRootDataAttributes2["activationDirection"] = "data-activation-direction";
  TabsRootDataAttributes2["orientation"] = "data-orientation";
  return TabsRootDataAttributes2;
})({});

// node_modules/@base-ui/react/esm/tabs/root/stateAttributesMapping.js
var tabsStateAttributesMapping = {
  tabActivationDirection: (dir) => ({
    [TabsRootDataAttributes.activationDirection]: dir
  })
};

// node_modules/@base-ui/react/esm/tabs/root/TabsRoot.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var TabsRoot = React5.forwardRef(function TabsRoot2(componentProps, forwardedRef) {
  const {
    className,
    defaultValue: defaultValueProp = 0,
    onValueChange: onValueChangeProp,
    orientation = "horizontal",
    render,
    value: valueProp,
    style,
    ...elementProps
  } = componentProps;
  const hasExplicitDefaultValueProp = Object.hasOwn(componentProps, "defaultValue");
  const tabPanelRefs = React5.useRef([]);
  const [mountedTabPanels, setMountedTabPanels] = React5.useState(() => /* @__PURE__ */ new Map());
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValueProp,
    name: "Tabs",
    state: "value"
  });
  const isControlled = valueProp !== void 0;
  const [tabMap, setTabMap] = React5.useState(() => /* @__PURE__ */ new Map());
  const getTabElementBySelectedValue = React5.useCallback((selectedValue) => {
    if (selectedValue === void 0) {
      return null;
    }
    for (const [tabElement, tabMetadata] of tabMap.entries()) {
      if (tabMetadata != null && selectedValue === (tabMetadata.value ?? tabMetadata.index)) {
        return tabElement;
      }
    }
    return null;
  }, [tabMap]);
  const [activationDirectionState, setActivationDirectionState] = React5.useState(() => ({
    previousValue: value,
    tabActivationDirection: "none"
  }));
  const {
    previousValue,
    tabActivationDirection: committedTabActivationDirection
  } = activationDirectionState;
  let tabActivationDirection = committedTabActivationDirection;
  let directionComputationIncomplete = false;
  if (previousValue !== value) {
    tabActivationDirection = computeActivationDirection(previousValue, value, orientation, tabMap);
    directionComputationIncomplete = previousValue != null && value != null && getTabElementBySelectedValue(value) == null;
  }
  const nextPreviousValue = directionComputationIncomplete ? previousValue : value;
  const shouldSyncActivationDirectionState = previousValue !== nextPreviousValue || committedTabActivationDirection !== tabActivationDirection;
  useIsoLayoutEffect(() => {
    if (!shouldSyncActivationDirectionState) {
      return;
    }
    setActivationDirectionState({
      previousValue: nextPreviousValue,
      tabActivationDirection
    });
  }, [nextPreviousValue, shouldSyncActivationDirectionState, tabActivationDirection]);
  const onValueChange = useStableCallback((newValue, eventDetails) => {
    const activationDirection = computeActivationDirection(value, newValue, orientation, tabMap);
    eventDetails.activationDirection = activationDirection;
    onValueChangeProp == null ? void 0 : onValueChangeProp(newValue, eventDetails);
    if (eventDetails.isCanceled) {
      return;
    }
    setValue(newValue);
  });
  const registerMountedTabPanel = useStableCallback((panelValue, panelId) => {
    setMountedTabPanels((prev) => {
      if (prev.get(panelValue) === panelId) {
        return prev;
      }
      const next = new Map(prev);
      next.set(panelValue, panelId);
      return next;
    });
  });
  const unregisterMountedTabPanel = useStableCallback((panelValue, panelId) => {
    setMountedTabPanels((prev) => {
      if (!prev.has(panelValue) || prev.get(panelValue) !== panelId) {
        return prev;
      }
      const next = new Map(prev);
      next.delete(panelValue);
      return next;
    });
  });
  const getTabPanelIdByValue = React5.useCallback((tabValue) => {
    return mountedTabPanels.get(tabValue);
  }, [mountedTabPanels]);
  const getTabIdByPanelValue = React5.useCallback((tabPanelValue) => {
    for (const tabMetadata of tabMap.values()) {
      if (tabPanelValue === (tabMetadata == null ? void 0 : tabMetadata.value)) {
        return tabMetadata == null ? void 0 : tabMetadata.id;
      }
    }
    return void 0;
  }, [tabMap]);
  const tabsContextValue = React5.useMemo(() => ({
    getTabElementBySelectedValue,
    getTabIdByPanelValue,
    getTabPanelIdByValue,
    onValueChange,
    orientation,
    registerMountedTabPanel,
    setTabMap,
    unregisterMountedTabPanel,
    tabActivationDirection,
    value
  }), [getTabElementBySelectedValue, getTabIdByPanelValue, getTabPanelIdByValue, onValueChange, orientation, registerMountedTabPanel, setTabMap, unregisterMountedTabPanel, tabActivationDirection, value]);
  const selectedTabMetadata = React5.useMemo(() => {
    for (const tabMetadata of tabMap.values()) {
      if (tabMetadata != null && tabMetadata.value === value) {
        return tabMetadata;
      }
    }
    return void 0;
  }, [tabMap, value]);
  const firstEnabledTabValue = React5.useMemo(() => {
    for (const tabMetadata of tabMap.values()) {
      if (tabMetadata != null && !tabMetadata.disabled) {
        return tabMetadata.value;
      }
    }
    return void 0;
  }, [tabMap]);
  useIsoLayoutEffect(() => {
    if (isControlled || tabMap.size === 0) {
      return;
    }
    const selectionIsDisabled = selectedTabMetadata == null ? void 0 : selectedTabMetadata.disabled;
    const selectionIsMissing = selectedTabMetadata == null && value !== null;
    const shouldHonorExplicitDefaultSelection = hasExplicitDefaultValueProp && selectionIsDisabled && value === defaultValueProp;
    if (shouldHonorExplicitDefaultSelection) {
      return;
    }
    if (!selectionIsDisabled && !selectionIsMissing) {
      return;
    }
    const fallbackValue = firstEnabledTabValue ?? null;
    if (value === fallbackValue) {
      return;
    }
    setValue(fallbackValue);
    setActivationDirectionState((prev) => {
      if (prev.tabActivationDirection === "none") {
        return prev;
      }
      return {
        ...prev,
        tabActivationDirection: "none"
      };
    });
  }, [defaultValueProp, firstEnabledTabValue, hasExplicitDefaultValueProp, isControlled, selectedTabMetadata, setValue, tabMap, value]);
  const state = {
    orientation,
    tabActivationDirection
  };
  const element = useRenderElement("div", componentProps, {
    state,
    ref: forwardedRef,
    props: elementProps,
    stateAttributesMapping: tabsStateAttributesMapping
  });
  return (0, import_jsx_runtime2.jsx)(TabsRootContext.Provider, {
    value: tabsContextValue,
    children: (0, import_jsx_runtime2.jsx)(CompositeList, {
      elementsRef: tabPanelRefs,
      children: element
    })
  });
});
if (true) TabsRoot.displayName = "TabsRoot";
function computeActivationDirection(oldValue, newValue, orientation, tabMap) {
  if (oldValue == null || newValue == null) {
    return "none";
  }
  let oldTab = null;
  let newTab = null;
  for (const [tabElement, tabMetadata] of tabMap.entries()) {
    if (tabMetadata == null) {
      continue;
    }
    const tabValue = tabMetadata.value ?? tabMetadata.index;
    if (oldValue === tabValue) {
      oldTab = tabElement;
    }
    if (newValue === tabValue) {
      newTab = tabElement;
    }
    if (oldTab != null && newTab != null) {
      break;
    }
  }
  if (oldTab == null || newTab == null) {
    if (oldTab !== newTab && (typeof oldValue === "number" || typeof oldValue === "string") && typeof oldValue === typeof newValue) {
      if (orientation === "horizontal") {
        return newValue > oldValue ? "right" : "left";
      }
      return newValue > oldValue ? "down" : "up";
    }
    return "none";
  }
  const oldRect = oldTab.getBoundingClientRect();
  const newRect = newTab.getBoundingClientRect();
  if (orientation === "horizontal") {
    if (newRect.left < oldRect.left) {
      return "left";
    }
    if (newRect.left > oldRect.left) {
      return "right";
    }
  } else {
    if (newRect.top < oldRect.top) {
      return "up";
    }
    if (newRect.top > oldRect.top) {
      return "down";
    }
  }
  return "none";
}

// node_modules/@base-ui/react/esm/tabs/tab/TabsTab.js
var React10 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/owner.js
function ownerDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}

// node_modules/@base-ui/utils/esm/useId.js
var React6 = __toESM(require_react());
var globalId = 0;
function useGlobalId(idOverride, prefix = "mui") {
  const [defaultId, setDefaultId] = React6.useState(idOverride);
  const id = idOverride || defaultId;
  React6.useEffect(() => {
    if (defaultId == null) {
      globalId += 1;
      setDefaultId(`${prefix}-${globalId}`);
    }
  }, [defaultId, prefix]);
  return id;
}
var maybeReactUseId = SafeReact.useId;
function useId(idOverride, prefix) {
  if (maybeReactUseId !== void 0) {
    const reactId = maybeReactUseId();
    return idOverride ?? (prefix ? `${prefix}-${reactId}` : reactId);
  }
  return useGlobalId(idOverride, prefix);
}

// node_modules/@base-ui/react/esm/utils/useBaseUiId.js
function useBaseUiId(idOverride) {
  return useId(idOverride, "base-ui");
}

// node_modules/@base-ui/react/esm/composite/constants.js
var ACTIVE_COMPOSITE_ITEM = "data-composite-item-active";

// node_modules/@base-ui/react/esm/composite/item/useCompositeItem.js
var React8 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/composite/list/useCompositeListItem.js
var React7 = __toESM(require_react(), 1);
var IndexGuessBehavior = (function(IndexGuessBehavior2) {
  IndexGuessBehavior2[IndexGuessBehavior2["None"] = 0] = "None";
  IndexGuessBehavior2[IndexGuessBehavior2["GuessFromOrder"] = 1] = "GuessFromOrder";
  return IndexGuessBehavior2;
})({});
function useCompositeListItem(params = {}) {
  const {
    label,
    metadata,
    textRef,
    indexGuessBehavior,
    index: externalIndex
  } = params;
  const {
    register,
    unregister,
    subscribeMapChange,
    elementsRef,
    labelsRef,
    nextIndexRef
  } = useCompositeListContext();
  const indexRef = React7.useRef(-1);
  const [index, setIndex] = React7.useState(externalIndex ?? (indexGuessBehavior === IndexGuessBehavior.GuessFromOrder ? () => {
    if (indexRef.current === -1) {
      const newIndex = nextIndexRef.current;
      nextIndexRef.current += 1;
      indexRef.current = newIndex;
    }
    return indexRef.current;
  } : -1));
  const componentRef = React7.useRef(null);
  const ref = React7.useCallback((node) => {
    var _a;
    componentRef.current = node;
    if (index !== -1 && node !== null) {
      elementsRef.current[index] = node;
      if (labelsRef) {
        const isLabelDefined = label !== void 0;
        labelsRef.current[index] = isLabelDefined ? label : ((_a = textRef == null ? void 0 : textRef.current) == null ? void 0 : _a.textContent) ?? node.textContent;
      }
    }
  }, [index, elementsRef, labelsRef, label, textRef]);
  useIsoLayoutEffect(() => {
    if (externalIndex != null) {
      return void 0;
    }
    const node = componentRef.current;
    if (node) {
      register(node, metadata);
      return () => {
        unregister(node);
      };
    }
    return void 0;
  }, [externalIndex, register, unregister, metadata]);
  useIsoLayoutEffect(() => {
    if (externalIndex != null) {
      return void 0;
    }
    return subscribeMapChange((map) => {
      var _a;
      const i = componentRef.current ? (_a = map.get(componentRef.current)) == null ? void 0 : _a.index : null;
      if (i != null) {
        setIndex(i);
      }
    });
  }, [externalIndex, subscribeMapChange, setIndex]);
  return React7.useMemo(() => ({
    ref,
    index
  }), [index, ref]);
}

// node_modules/@base-ui/react/esm/composite/item/useCompositeItem.js
function useCompositeItem(params = {}) {
  const {
    highlightItemOnHover,
    highlightedIndex,
    onHighlightedIndexChange
  } = useCompositeRootContext();
  const {
    ref,
    index
  } = useCompositeListItem(params);
  const isHighlighted = highlightedIndex === index;
  const itemRef = React8.useRef(null);
  const mergedRef = useMergedRefs(ref, itemRef);
  const compositeProps = React8.useMemo(() => ({
    tabIndex: isHighlighted ? 0 : -1,
    onFocus() {
      onHighlightedIndexChange(index);
    },
    onMouseMove() {
      const item = itemRef.current;
      if (!highlightItemOnHover || !item) {
        return;
      }
      const disabled2 = item.hasAttribute("disabled") || item.ariaDisabled === "true";
      if (!isHighlighted && !disabled2) {
        item.focus();
      }
    }
  }), [isHighlighted, onHighlightedIndexChange, index, highlightItemOnHover]);
  return {
    compositeProps,
    compositeRef: mergedRef,
    index
  };
}

// node_modules/@base-ui/react/esm/tabs/list/TabsListContext.js
var React9 = __toESM(require_react(), 1);
var TabsListContext = React9.createContext(void 0);
if (true) TabsListContext.displayName = "TabsListContext";
function useTabsListContext() {
  const context = React9.useContext(TabsListContext);
  if (context === void 0) {
    throw new Error(true ? "Base UI: TabsListContext is missing. TabsList parts must be placed within <Tabs.List>." : formatErrorMessage_default(65));
  }
  return context;
}

// node_modules/@base-ui/react/esm/utils/reason-parts.js
var reason_parts_exports = {};
__export(reason_parts_exports, {
  cancelOpen: () => cancelOpen,
  chipRemovePress: () => chipRemovePress,
  clearPress: () => clearPress,
  closePress: () => closePress,
  closeWatcher: () => closeWatcher,
  dayPress: () => dayPress,
  decrementPress: () => decrementPress,
  disabled: () => disabled,
  drag: () => drag,
  escapeKey: () => escapeKey,
  focusOut: () => focusOut,
  imperativeAction: () => imperativeAction,
  incrementPress: () => incrementPress,
  inputBlur: () => inputBlur,
  inputChange: () => inputChange,
  inputClear: () => inputClear,
  inputPaste: () => inputPaste,
  inputPress: () => inputPress,
  itemPress: () => itemPress,
  keyboard: () => keyboard,
  linkPress: () => linkPress,
  listNavigation: () => listNavigation,
  monthChange: () => monthChange,
  none: () => none,
  outsidePress: () => outsidePress,
  pointer: () => pointer,
  scrub: () => scrub,
  siblingOpen: () => siblingOpen,
  swipe: () => swipe,
  trackPress: () => trackPress,
  triggerFocus: () => triggerFocus,
  triggerHover: () => triggerHover,
  triggerPress: () => triggerPress,
  valuePropChange: () => valuePropChange,
  wheel: () => wheel,
  windowResize: () => windowResize
});
var none = "none";
var triggerPress = "trigger-press";
var triggerHover = "trigger-hover";
var triggerFocus = "trigger-focus";
var outsidePress = "outside-press";
var itemPress = "item-press";
var closePress = "close-press";
var linkPress = "link-press";
var clearPress = "clear-press";
var chipRemovePress = "chip-remove-press";
var trackPress = "track-press";
var incrementPress = "increment-press";
var decrementPress = "decrement-press";
var inputChange = "input-change";
var inputClear = "input-clear";
var inputBlur = "input-blur";
var inputPaste = "input-paste";
var inputPress = "input-press";
var focusOut = "focus-out";
var escapeKey = "escape-key";
var closeWatcher = "close-watcher";
var listNavigation = "list-navigation";
var keyboard = "keyboard";
var pointer = "pointer";
var drag = "drag";
var wheel = "wheel";
var scrub = "scrub";
var cancelOpen = "cancel-open";
var siblingOpen = "sibling-open";
var disabled = "disabled";
var imperativeAction = "imperative-action";
var swipe = "swipe";
var windowResize = "window-resize";
var dayPress = "day-press";
var monthChange = "month-change";
var valuePropChange = "value-prop-change";

// node_modules/@base-ui/react/esm/utils/createBaseUIEventDetails.js
function createChangeEventDetails(reason, event, trigger, customProperties) {
  let canceled = false;
  let allowPropagation = false;
  const custom = customProperties ?? EMPTY_OBJECT;
  const details = {
    reason,
    event: event ?? new Event("base-ui"),
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      allowPropagation = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return allowPropagation;
    },
    trigger,
    ...custom
  };
  return details;
}

// node_modules/@base-ui/utils/esm/detectBrowser.js
var hasNavigator = typeof navigator !== "undefined";
var nav = getNavigatorData();
var platform = getPlatform();
var userAgent = getUserAgent();
var isWebKit = typeof CSS === "undefined" || !CSS.supports ? false : CSS.supports("-webkit-backdrop-filter:none");
var isIOS = (
  // iPads can claim to be MacIntel
  nav.platform === "MacIntel" && nav.maxTouchPoints > 1 ? true : /iP(hone|ad|od)|iOS/.test(nav.platform)
);
var isFirefox = hasNavigator && /firefox/i.test(userAgent);
var isSafari = hasNavigator && /apple/i.test(navigator.vendor);
var isEdge = hasNavigator && /Edg/i.test(userAgent);
var isAndroid = hasNavigator && /android/i.test(platform) || /android/i.test(userAgent);
var isMac = hasNavigator && platform.toLowerCase().startsWith("mac") && !navigator.maxTouchPoints;
var isJSDOM = userAgent.includes("jsdom/");
function getNavigatorData() {
  if (!hasNavigator) {
    return {
      platform: "",
      maxTouchPoints: -1
    };
  }
  const uaData = navigator.userAgentData;
  if (uaData == null ? void 0 : uaData.platform) {
    return {
      platform: uaData.platform,
      maxTouchPoints: navigator.maxTouchPoints
    };
  }
  return {
    platform: navigator.platform ?? "",
    maxTouchPoints: navigator.maxTouchPoints ?? -1
  };
}
function getUserAgent() {
  if (!hasNavigator) {
    return "";
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map(({
      brand,
      version
    }) => `${brand}/${version}`).join(" ");
  }
  return navigator.userAgent;
}
function getPlatform() {
  if (!hasNavigator) {
    return "";
  }
  const uaData = navigator.userAgentData;
  if (uaData == null ? void 0 : uaData.platform) {
    return uaData.platform;
  }
  return navigator.platform ?? "";
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/constants.js
var ARROW_LEFT = "ArrowLeft";
var ARROW_RIGHT = "ArrowRight";
var ARROW_UP = "ArrowUp";
var ARROW_DOWN = "ArrowDown";

// node_modules/@base-ui/react/esm/floating-ui-react/utils/shadowDom.js
function activeElement(doc) {
  var _a;
  let element = doc.activeElement;
  while (((_a = element == null ? void 0 : element.shadowRoot) == null ? void 0 : _a.activeElement) != null) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}
function contains(parent, child) {
  var _a;
  if (!parent || !child) {
    return false;
  }
  const rootNode = (_a = child.getRootNode) == null ? void 0 : _a.call(child);
  if (parent.contains(child)) {
    return true;
  }
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getTarget(event) {
  if ("composedPath" in event) {
    return event.composedPath()[0];
  }
  return event.target;
}

// node_modules/@base-ui/react/esm/floating-ui-react/utils/event.js
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

// node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
var sides = ["top", "right", "bottom", "left"];
var alignments = ["start", "end"];
var placements = sides.reduce((acc, side) => acc.concat(side, side + "-" + alignments[0], side + "-" + alignments[1]), []);
var round = Math.round;
var floor = Math.floor;

// node_modules/@base-ui/react/esm/floating-ui-react/utils/composite.js
function isDifferentGridRow(index, cols, prevRow) {
  return Math.floor(index / cols) !== prevRow;
}
function isIndexOutOfListBounds(list, index) {
  return index < 0 || index >= list.length;
}
function getMinListIndex(listRef, disabledIndices) {
  return findNonDisabledListIndex(listRef.current, {
    disabledIndices
  });
}
function getMaxListIndex(listRef, disabledIndices) {
  return findNonDisabledListIndex(listRef.current, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices
  });
}
function findNonDisabledListIndex(list, {
  startingIndex = -1,
  decrement = false,
  disabledIndices,
  amount = 1
} = {}) {
  let index = startingIndex;
  do {
    index += decrement ? -amount : amount;
  } while (index >= 0 && index <= list.length - 1 && isListIndexDisabled(list, index, disabledIndices));
  return index;
}
function getGridNavigatedIndex(list, {
  event,
  orientation,
  loopFocus,
  onLoop,
  rtl,
  cols,
  disabledIndices,
  minIndex,
  maxIndex,
  prevIndex,
  stopEvent: stop = false
}) {
  let nextIndex = prevIndex;
  let verticalDirection;
  if (event.key === ARROW_UP) {
    verticalDirection = "up";
  } else if (event.key === ARROW_DOWN) {
    verticalDirection = "down";
  }
  if (verticalDirection) {
    const rows = [];
    const rowIndexMap = [];
    let hasRoleRow = false;
    let visibleItemCount = 0;
    {
      let currentRowEl = null;
      let currentRowIndex = -1;
      list.forEach((el, idx) => {
        if (el == null) {
          return;
        }
        visibleItemCount += 1;
        const rowEl = el.closest('[role="row"]');
        if (rowEl) {
          hasRoleRow = true;
        }
        if (rowEl !== currentRowEl || currentRowIndex === -1) {
          currentRowEl = rowEl;
          currentRowIndex += 1;
          rows[currentRowIndex] = [];
        }
        rows[currentRowIndex].push(idx);
        rowIndexMap[idx] = currentRowIndex;
      });
    }
    let hasDomRows = false;
    let inferredDomCols = 0;
    if (hasRoleRow) {
      for (const row of rows) {
        const rowLength = row.length;
        if (rowLength > inferredDomCols) {
          inferredDomCols = rowLength;
        }
        if (rowLength !== cols) {
          hasDomRows = true;
        }
      }
    }
    const hasVirtualizedGaps = hasDomRows && visibleItemCount < list.length;
    const verticalCols = inferredDomCols || cols;
    const navigateVertically = (direction) => {
      if (!hasDomRows || prevIndex === -1) {
        return void 0;
      }
      const currentRow = rowIndexMap[prevIndex];
      if (currentRow == null) {
        return void 0;
      }
      const colInRow = rows[currentRow].indexOf(prevIndex);
      const step = direction === "up" ? -1 : 1;
      for (let nextRow = currentRow + step, i = 0; i < rows.length; i += 1, nextRow += step) {
        if (nextRow < 0 || nextRow >= rows.length) {
          if (!loopFocus || hasVirtualizedGaps) {
            return void 0;
          }
          nextRow = nextRow < 0 ? rows.length - 1 : 0;
          if (onLoop) {
            const clampedCol = Math.min(colInRow, rows[nextRow].length - 1);
            const targetItemIndex = rows[nextRow][clampedCol] ?? rows[nextRow][0];
            const returnedItemIndex = onLoop(event, prevIndex, targetItemIndex);
            nextRow = rowIndexMap[returnedItemIndex] ?? nextRow;
          }
        }
        const targetRow = rows[nextRow];
        for (let col = Math.min(colInRow, targetRow.length - 1); col >= 0; col -= 1) {
          const candidate = targetRow[col];
          if (!isListIndexDisabled(list, candidate, disabledIndices)) {
            return candidate;
          }
        }
      }
      return void 0;
    };
    const navigateVerticallyWithInferredRows = (direction) => {
      if (!hasVirtualizedGaps || prevIndex === -1) {
        return void 0;
      }
      const colInRow = prevIndex % verticalCols;
      const rowStep = direction === "up" ? -verticalCols : verticalCols;
      const lastRowStart = maxIndex - maxIndex % verticalCols;
      const rowCount = floor(maxIndex / verticalCols) + 1;
      for (let rowStart = prevIndex - colInRow + rowStep, i = 0; i < rowCount; i += 1, rowStart += rowStep) {
        if (rowStart < 0 || rowStart > maxIndex) {
          if (!loopFocus) {
            return void 0;
          }
          rowStart = rowStart < 0 ? lastRowStart : 0;
        }
        const rowEnd = Math.min(rowStart + verticalCols - 1, maxIndex);
        for (let candidate = Math.min(rowStart + colInRow, rowEnd); candidate >= rowStart; candidate -= 1) {
          if (!isListIndexDisabled(list, candidate, disabledIndices)) {
            return candidate;
          }
        }
      }
      return void 0;
    };
    if (stop) {
      stopEvent(event);
    }
    const verticalCandidate = navigateVertically(verticalDirection) ?? navigateVerticallyWithInferredRows(verticalDirection);
    if (verticalCandidate !== void 0) {
      nextIndex = verticalCandidate;
    } else if (prevIndex === -1) {
      nextIndex = verticalDirection === "up" ? maxIndex : minIndex;
    } else {
      nextIndex = findNonDisabledListIndex(list, {
        startingIndex: prevIndex,
        amount: verticalCols,
        decrement: verticalDirection === "up",
        disabledIndices
      });
      if (loopFocus) {
        if (verticalDirection === "up" && (prevIndex - verticalCols < minIndex || nextIndex < 0)) {
          const col = prevIndex % verticalCols;
          const maxCol = maxIndex % verticalCols;
          const offset = maxIndex - (maxCol - col);
          if (maxCol === col) {
            nextIndex = maxIndex;
          } else {
            nextIndex = maxCol > col ? offset : offset - verticalCols;
          }
          if (onLoop) {
            nextIndex = onLoop(event, prevIndex, nextIndex);
          }
        }
        if (verticalDirection === "down" && prevIndex + verticalCols > maxIndex) {
          nextIndex = findNonDisabledListIndex(list, {
            startingIndex: prevIndex % verticalCols - verticalCols,
            amount: verticalCols,
            disabledIndices
          });
          if (onLoop) {
            nextIndex = onLoop(event, prevIndex, nextIndex);
          }
        }
      }
    }
    if (isIndexOutOfListBounds(list, nextIndex)) {
      nextIndex = prevIndex;
    }
  }
  if (orientation === "both") {
    const prevRow = floor(prevIndex / cols);
    if (event.key === (rtl ? ARROW_LEFT : ARROW_RIGHT)) {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledListIndex(list, {
          startingIndex: prevIndex,
          disabledIndices
        });
        if (loopFocus && isDifferentGridRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledListIndex(list, {
            startingIndex: prevIndex - prevIndex % cols - 1,
            disabledIndices
          });
          if (onLoop) {
            nextIndex = onLoop(event, prevIndex, nextIndex);
          }
        }
      } else if (loopFocus) {
        nextIndex = findNonDisabledListIndex(list, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
        if (onLoop) {
          nextIndex = onLoop(event, prevIndex, nextIndex);
        }
      }
      if (isDifferentGridRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    if (event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT)) {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledListIndex(list, {
          startingIndex: prevIndex,
          decrement: true,
          disabledIndices
        });
        if (loopFocus && isDifferentGridRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledListIndex(list, {
            startingIndex: prevIndex + (cols - prevIndex % cols),
            decrement: true,
            disabledIndices
          });
          if (onLoop) {
            nextIndex = onLoop(event, prevIndex, nextIndex);
          }
        }
      } else if (loopFocus) {
        nextIndex = findNonDisabledListIndex(list, {
          startingIndex: prevIndex + (cols - prevIndex % cols),
          decrement: true,
          disabledIndices
        });
        if (onLoop) {
          nextIndex = onLoop(event, prevIndex, nextIndex);
        }
      }
      if (isDifferentGridRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    const lastRow = floor(maxIndex / cols) === prevRow;
    if (isIndexOutOfListBounds(list, nextIndex)) {
      if (loopFocus && lastRow) {
        nextIndex = event.key === (rtl ? ARROW_RIGHT : ARROW_LEFT) ? maxIndex : findNonDisabledListIndex(list, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
        if (onLoop) {
          nextIndex = onLoop(event, prevIndex, nextIndex);
        }
      } else {
        nextIndex = prevIndex;
      }
    }
  }
  return nextIndex;
}
function createGridCellMap(sizes, cols, dense) {
  const cellMap = [];
  let startIndex = 0;
  sizes.forEach(({
    width,
    height
  }, index) => {
    if (width > cols) {
      if (true) {
        throw new Error(`[Floating UI]: Invalid grid - item width at index ${index} is greater than grid columns`);
      }
    }
    let itemPlaced = false;
    if (dense) {
      startIndex = 0;
    }
    while (!itemPlaced) {
      const targetCells = [];
      for (let i = 0; i < width; i += 1) {
        for (let j = 0; j < height; j += 1) {
          targetCells.push(startIndex + i + j * cols);
        }
      }
      if (startIndex % cols + width <= cols && targetCells.every((cell) => cellMap[cell] == null)) {
        targetCells.forEach((cell) => {
          cellMap[cell] = index;
        });
        itemPlaced = true;
      } else {
        startIndex += 1;
      }
    }
  });
  return [...cellMap];
}
function getGridCellIndexOfCorner(index, sizes, cellMap, cols, corner) {
  if (index === -1) {
    return -1;
  }
  const firstCellIndex = cellMap.indexOf(index);
  const sizeItem = sizes[index];
  switch (corner) {
    case "tl":
      return firstCellIndex;
    case "tr":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + sizeItem.width - 1;
    case "bl":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + (sizeItem.height - 1) * cols;
    case "br":
      return cellMap.lastIndexOf(index);
    default:
      return -1;
  }
}
function getGridCellIndices(indices, cellMap) {
  return cellMap.flatMap((index, cellIndex) => indices.includes(index) ? [cellIndex] : []);
}
function isListIndexDisabled(list, index, disabledIndices) {
  const isExplicitlyDisabled = typeof disabledIndices === "function" ? disabledIndices(index) : (disabledIndices == null ? void 0 : disabledIndices.includes(index)) ?? false;
  if (isExplicitlyDisabled) {
    return true;
  }
  const element = list[index];
  if (!element) {
    return false;
  }
  if (!isElementVisible(element)) {
    return true;
  }
  return !disabledIndices && (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true");
}
function isElementVisible(element) {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  return getComputedStyle2(element).display !== "none";
}

// node_modules/@base-ui/react/esm/tabs/tab/TabsTab.js
var TabsTab = React10.forwardRef(function TabsTab2(componentProps, forwardedRef) {
  const {
    className,
    disabled: disabled2 = false,
    render,
    value,
    id: idProp,
    nativeButton = true,
    style,
    ...elementProps
  } = componentProps;
  const {
    value: activeTabValue,
    getTabPanelIdByValue,
    orientation
  } = useTabsRootContext();
  const {
    activateOnFocus,
    highlightedTabIndex,
    onTabActivation,
    registerTabResizeObserverElement,
    setHighlightedTabIndex,
    tabsListElement
  } = useTabsListContext();
  const id = useBaseUiId(idProp);
  const tabMetadata = React10.useMemo(() => ({
    disabled: disabled2,
    id,
    value
  }), [disabled2, id, value]);
  const {
    compositeProps,
    compositeRef,
    index
    // hook is used instead of the CompositeItem component
    // because the index is needed for Tab internals
  } = useCompositeItem({
    metadata: tabMetadata
  });
  const active = value === activeTabValue;
  const isNavigatingRef = React10.useRef(false);
  const tabElementRef = React10.useRef(null);
  React10.useEffect(() => {
    const tabElement = tabElementRef.current;
    if (!tabElement) {
      return void 0;
    }
    return registerTabResizeObserverElement(tabElement);
  }, [registerTabResizeObserverElement]);
  useIsoLayoutEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
      return;
    }
    if (!(active && index > -1 && highlightedTabIndex !== index)) {
      return;
    }
    const listElement = tabsListElement;
    if (listElement != null) {
      const activeEl = activeElement(ownerDocument(listElement));
      if (activeEl && contains(listElement, activeEl)) {
        return;
      }
    }
    if (!disabled2) {
      setHighlightedTabIndex(index);
    }
  }, [active, index, highlightedTabIndex, setHighlightedTabIndex, disabled2, tabsListElement]);
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled: disabled2,
    native: nativeButton,
    focusableWhenDisabled: true
  });
  const tabPanelId = getTabPanelIdByValue(value);
  const isPressingRef = React10.useRef(false);
  const isMainButtonRef = React10.useRef(false);
  function onClick(event) {
    if (active || disabled2) {
      return;
    }
    onTabActivation(value, createChangeEventDetails(reason_parts_exports.none, event.nativeEvent, void 0, {
      activationDirection: "none"
    }));
  }
  function onFocus(event) {
    if (active) {
      return;
    }
    if (index > -1 && !disabled2) {
      setHighlightedTabIndex(index);
    }
    if (disabled2) {
      return;
    }
    if (activateOnFocus && (!isPressingRef.current || // keyboard or touch focus
    isPressingRef.current && isMainButtonRef.current)) {
      onTabActivation(value, createChangeEventDetails(reason_parts_exports.none, event.nativeEvent, void 0, {
        activationDirection: "none"
      }));
    }
  }
  function onPointerDown(event) {
    if (active || disabled2) {
      return;
    }
    isPressingRef.current = true;
    function handlePointerUp() {
      isPressingRef.current = false;
      isMainButtonRef.current = false;
    }
    if (!event.button || event.button === 0) {
      isMainButtonRef.current = true;
      const doc = ownerDocument(event.currentTarget);
      doc.addEventListener("pointerup", handlePointerUp, {
        once: true
      });
    }
  }
  const state = {
    disabled: disabled2,
    active,
    orientation
  };
  const element = useRenderElement("button", componentProps, {
    state,
    ref: [forwardedRef, buttonRef, compositeRef, tabElementRef],
    props: [compositeProps, {
      role: "tab",
      "aria-controls": tabPanelId,
      "aria-selected": active,
      id,
      onClick,
      onFocus,
      onPointerDown,
      [ACTIVE_COMPOSITE_ITEM]: active ? "" : void 0,
      onKeyDownCapture() {
        isNavigatingRef.current = true;
      }
    }, elementProps, getButtonProps]
  });
  return element;
});
if (true) TabsTab.displayName = "TabsTab";

// node_modules/@base-ui/react/esm/tabs/indicator/TabsIndicator.js
var React13 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/useForcedRerendering.js
var React11 = __toESM(require_react());
function useForcedRerendering() {
  const [, setState] = React11.useState({});
  return React11.useCallback(() => {
    setState({});
  }, []);
}

// node_modules/@base-ui/react/esm/utils/getCssDimensions.js
function getCssDimensions(element) {
  const css = getComputedStyle2(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height
  };
}

// node_modules/@base-ui/react/esm/utils/useIsHydrating.js
var import_shim = __toESM(require_shim(), 1);
function subscribe() {
  return NOOP;
}
function getSnapshot() {
  return false;
}
function getServerSnapshot() {
  return true;
}
function useIsHydrating() {
  return (0, import_shim.useSyncExternalStore)(subscribe, getSnapshot, getServerSnapshot);
}

// node_modules/@base-ui/react/esm/tabs/indicator/prehydrationScript.min.js
var script = '!function(){const t=document.currentScript.previousElementSibling;if(!t)return;const e=t.closest(\'[role="tablist"]\');if(!e)return;const i=e.querySelector("[data-active]");if(!i)return;if(0===i.offsetWidth||0===e.offsetWidth)return;let o=0,n=0,h=0,l=0,r=0,f=0;function s(t){const e=getComputedStyle(t);let i=parseFloat(e.width)||0,o=parseFloat(e.height)||0;return(Math.round(i)!==t.offsetWidth||Math.round(o)!==t.offsetHeight)&&(i=t.offsetWidth,o=t.offsetHeight),{width:i,height:o}}if(null!=i&&null!=e){const{width:t,height:c}=s(i),{width:u,height:d}=s(e),a=i.getBoundingClientRect(),g=e.getBoundingClientRect(),p=u>0?g.width/u:1,b=d>0?g.height/d:1;if(Math.abs(p)>Number.EPSILON&&Math.abs(b)>Number.EPSILON){const t=a.left-g.left,i=a.top-g.top;o=t/p+e.scrollLeft-e.clientLeft,h=i/b+e.scrollTop-e.clientTop}else o=i.offsetLeft,h=i.offsetTop;r=t,f=c,n=e.scrollWidth-o-r,l=e.scrollHeight-h-f}function c(e,i){t.style.setProperty(`--active-tab-${e}`,`${i}px`)}c("left",o),c("right",n),c("top",h),c("bottom",l),c("width",r),c("height",f),r>0&&f>0&&t.removeAttribute("hidden")}();';

// node_modules/@base-ui/react/esm/tabs/indicator/TabsIndicatorCssVars.js
var TabsIndicatorCssVars = (function(TabsIndicatorCssVars2) {
  TabsIndicatorCssVars2["activeTabLeft"] = "--active-tab-left";
  TabsIndicatorCssVars2["activeTabRight"] = "--active-tab-right";
  TabsIndicatorCssVars2["activeTabTop"] = "--active-tab-top";
  TabsIndicatorCssVars2["activeTabBottom"] = "--active-tab-bottom";
  TabsIndicatorCssVars2["activeTabWidth"] = "--active-tab-width";
  TabsIndicatorCssVars2["activeTabHeight"] = "--active-tab-height";
  return TabsIndicatorCssVars2;
})({});

// node_modules/@base-ui/react/esm/csp-provider/CSPContext.js
var React12 = __toESM(require_react(), 1);
var CSPContext = React12.createContext(void 0);
if (true) CSPContext.displayName = "CSPContext";
var DEFAULT_CSP_CONTEXT_VALUE = {
  disableStyleElements: false
};
function useCSPContext() {
  return React12.useContext(CSPContext) ?? DEFAULT_CSP_CONTEXT_VALUE;
}

// node_modules/@base-ui/react/esm/tabs/indicator/TabsIndicator.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var stateAttributesMapping = {
  ...tabsStateAttributesMapping,
  activeTabPosition: () => null,
  activeTabSize: () => null
};
var TabsIndicator = React13.forwardRef(function TabIndicator(componentProps, forwardedRef) {
  const {
    className,
    render,
    renderBeforeHydration = false,
    style: styleProp,
    ...elementProps
  } = componentProps;
  const {
    nonce
  } = useCSPContext();
  const {
    getTabElementBySelectedValue,
    orientation,
    tabActivationDirection,
    value
  } = useTabsRootContext();
  const {
    tabsListElement,
    registerIndicatorUpdateListener
  } = useTabsListContext();
  const isHydrating = useIsHydrating();
  const rerender = useForcedRerendering();
  React13.useEffect(() => {
    return registerIndicatorUpdateListener(rerender);
  }, [registerIndicatorUpdateListener, rerender]);
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  let width = 0;
  let height = 0;
  let isTabSelected = false;
  if (value != null && tabsListElement != null) {
    const activeTab = getTabElementBySelectedValue(value);
    isTabSelected = true;
    if (activeTab != null) {
      const {
        width: computedWidth,
        height: computedHeight
      } = getCssDimensions(activeTab);
      const {
        width: tabListWidth,
        height: tabListHeight
      } = getCssDimensions(tabsListElement);
      const tabRect = activeTab.getBoundingClientRect();
      const tabsListRect = tabsListElement.getBoundingClientRect();
      const scaleX = tabListWidth > 0 ? tabsListRect.width / tabListWidth : 1;
      const scaleY = tabListHeight > 0 ? tabsListRect.height / tabListHeight : 1;
      const hasNonZeroScale = Math.abs(scaleX) > Number.EPSILON && Math.abs(scaleY) > Number.EPSILON;
      if (hasNonZeroScale) {
        const tabLeftDelta = tabRect.left - tabsListRect.left;
        const tabTopDelta = tabRect.top - tabsListRect.top;
        left = tabLeftDelta / scaleX + tabsListElement.scrollLeft - tabsListElement.clientLeft;
        top = tabTopDelta / scaleY + tabsListElement.scrollTop - tabsListElement.clientTop;
      } else {
        left = activeTab.offsetLeft;
        top = activeTab.offsetTop;
      }
      width = computedWidth;
      height = computedHeight;
      right = tabsListElement.scrollWidth - left - width;
      bottom = tabsListElement.scrollHeight - top - height;
    }
  }
  const activeTabPosition = React13.useMemo(() => isTabSelected ? {
    left,
    right,
    top,
    bottom
  } : null, [left, right, top, bottom, isTabSelected]);
  const activeTabSize = React13.useMemo(() => isTabSelected ? {
    width,
    height
  } : null, [width, height, isTabSelected]);
  const style = React13.useMemo(() => {
    if (!isTabSelected) {
      return void 0;
    }
    return {
      [TabsIndicatorCssVars.activeTabLeft]: `${left}px`,
      [TabsIndicatorCssVars.activeTabRight]: `${right}px`,
      [TabsIndicatorCssVars.activeTabTop]: `${top}px`,
      [TabsIndicatorCssVars.activeTabBottom]: `${bottom}px`,
      [TabsIndicatorCssVars.activeTabWidth]: `${width}px`,
      [TabsIndicatorCssVars.activeTabHeight]: `${height}px`
    };
  }, [left, right, top, bottom, width, height, isTabSelected]);
  const displayIndicator = isTabSelected && width > 0 && height > 0;
  const state = {
    orientation,
    activeTabPosition,
    activeTabSize,
    tabActivationDirection
  };
  const element = useRenderElement("span", componentProps, {
    state,
    ref: forwardedRef,
    props: [{
      role: "presentation",
      style,
      hidden: !displayIndicator
      // do not display the indicator before the layout is settled
    }, elementProps, {
      suppressHydrationWarning: true
    }],
    stateAttributesMapping
  });
  if (value == null) {
    return null;
  }
  return (0, import_jsx_runtime3.jsxs)(React13.Fragment, {
    children: [element, isHydrating && renderBeforeHydration && (0, import_jsx_runtime3.jsx)("script", {
      nonce,
      dangerouslySetInnerHTML: {
        __html: script
      },
      suppressHydrationWarning: true
    })]
  });
});
if (true) TabsIndicator.displayName = "TabsIndicator";

// node_modules/@base-ui/react/esm/tabs/panel/TabsPanel.js
var React17 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/inertValue.js
function inertValue(value) {
  if (isReactVersionAtLeast(19)) {
    return value;
  }
  return value ? "true" : void 0;
}

// node_modules/@base-ui/react/esm/utils/stateAttributesMapping.js
var TransitionStatusDataAttributes = (function(TransitionStatusDataAttributes2) {
  TransitionStatusDataAttributes2["startingStyle"] = "data-starting-style";
  TransitionStatusDataAttributes2["endingStyle"] = "data-ending-style";
  return TransitionStatusDataAttributes2;
})({});
var STARTING_HOOK = {
  [TransitionStatusDataAttributes.startingStyle]: ""
};
var ENDING_HOOK = {
  [TransitionStatusDataAttributes.endingStyle]: ""
};
var transitionStatusMapping = {
  transitionStatus(value) {
    if (value === "starting") {
      return STARTING_HOOK;
    }
    if (value === "ending") {
      return ENDING_HOOK;
    }
    return null;
  }
};

// node_modules/@base-ui/react/esm/utils/useOpenChangeComplete.js
var React15 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/utils/useAnimationsFinished.js
var ReactDOM = __toESM(require_react_dom(), 1);

// node_modules/@base-ui/utils/esm/useOnMount.js
var React14 = __toESM(require_react(), 1);
var EMPTY = [];
function useOnMount(fn) {
  React14.useEffect(fn, EMPTY);
}

// node_modules/@base-ui/utils/esm/useAnimationFrame.js
var EMPTY2 = null;
var LAST_RAF = globalThis.requestAnimationFrame;
var Scheduler = class {
  constructor() {
    /* This implementation uses an array as a backing data-structure for frame callbacks.
     * It allows `O(1)` callback cancelling by inserting a `null` in the array, though it
     * never calls the native `cancelAnimationFrame` if there are no frames left. This can
     * be much more efficient if there is a call pattern that alterns as
     * "request-cancel-request-cancel-…".
     * But in the case of "request-request-…-cancel-cancel-…", it leaves the final animation
     * frame to run anyway. We turn that frame into a `O(1)` no-op via `callbacksCount`. */
    __publicField(this, "callbacks", []);
    __publicField(this, "callbacksCount", 0);
    __publicField(this, "nextId", 1);
    __publicField(this, "startId", 1);
    __publicField(this, "isScheduled", false);
    __publicField(this, "tick", (timestamp) => {
      var _a;
      this.isScheduled = false;
      const currentCallbacks = this.callbacks;
      const currentCallbacksCount = this.callbacksCount;
      this.callbacks = [];
      this.callbacksCount = 0;
      this.startId = this.nextId;
      if (currentCallbacksCount > 0) {
        for (let i = 0; i < currentCallbacks.length; i += 1) {
          (_a = currentCallbacks[i]) == null ? void 0 : _a.call(currentCallbacks, timestamp);
        }
      }
    });
  }
  request(fn) {
    const id = this.nextId;
    this.nextId += 1;
    this.callbacks.push(fn);
    this.callbacksCount += 1;
    const didRAFChange = LAST_RAF !== requestAnimationFrame && (LAST_RAF = requestAnimationFrame, true);
    if (!this.isScheduled || didRAFChange) {
      requestAnimationFrame(this.tick);
      this.isScheduled = true;
    }
    return id;
  }
  cancel(id) {
    const index = id - this.startId;
    if (index < 0 || index >= this.callbacks.length) {
      return;
    }
    this.callbacks[index] = null;
    this.callbacksCount -= 1;
  }
};
var scheduler = new Scheduler();
var AnimationFrame = class _AnimationFrame {
  constructor() {
    __publicField(this, "currentId", EMPTY2);
    __publicField(this, "cancel", () => {
      if (this.currentId !== EMPTY2) {
        scheduler.cancel(this.currentId);
        this.currentId = EMPTY2;
      }
    });
    __publicField(this, "disposeEffect", () => {
      return this.cancel;
    });
  }
  static create() {
    return new _AnimationFrame();
  }
  static request(fn) {
    return scheduler.request(fn);
  }
  static cancel(id) {
    return scheduler.cancel(id);
  }
  /**
   * Executes `fn` after `delay`, clearing any previously scheduled call.
   */
  request(fn) {
    this.cancel();
    this.currentId = scheduler.request(() => {
      this.currentId = EMPTY2;
      fn();
    });
  }
};
function useAnimationFrame() {
  const timeout = useRefWithInit(AnimationFrame.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}

// node_modules/@base-ui/react/esm/utils/resolveRef.js
function resolveRef(maybeRef) {
  if (maybeRef == null) {
    return maybeRef;
  }
  return "current" in maybeRef ? maybeRef.current : maybeRef;
}

// node_modules/@base-ui/react/esm/utils/useAnimationsFinished.js
function useAnimationsFinished(elementOrRef, waitForStartingStyleRemoved = false, treatAbortedAsFinished = true) {
  const frame = useAnimationFrame();
  return useStableCallback((fnToExecute, signal = null) => {
    frame.cancel();
    const element = resolveRef(elementOrRef);
    if (element == null) {
      return;
    }
    const resolvedElement = element;
    const done = () => {
      ReactDOM.flushSync(fnToExecute);
    };
    if (typeof resolvedElement.getAnimations !== "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
      fnToExecute();
      return;
    }
    function exec() {
      Promise.all(resolvedElement.getAnimations().map((animation) => animation.finished)).then(() => {
        if (!(signal == null ? void 0 : signal.aborted)) {
          done();
        }
      }).catch(() => {
        if (treatAbortedAsFinished) {
          if (!(signal == null ? void 0 : signal.aborted)) {
            done();
          }
          return;
        }
        const currentAnimations = resolvedElement.getAnimations();
        if (!(signal == null ? void 0 : signal.aborted) && currentAnimations.length > 0 && currentAnimations.some((animation) => animation.pending || animation.playState !== "finished")) {
          exec();
        }
      });
    }
    if (waitForStartingStyleRemoved) {
      const startingStyleAttribute = TransitionStatusDataAttributes.startingStyle;
      if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
        frame.request(exec);
        return;
      }
      const attributeObserver = new MutationObserver(() => {
        if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
          attributeObserver.disconnect();
          exec();
        }
      });
      attributeObserver.observe(resolvedElement, {
        attributes: true,
        attributeFilter: [startingStyleAttribute]
      });
      signal == null ? void 0 : signal.addEventListener("abort", () => attributeObserver.disconnect(), {
        once: true
      });
      return;
    }
    frame.request(exec);
  });
}

// node_modules/@base-ui/react/esm/utils/useOpenChangeComplete.js
function useOpenChangeComplete(parameters) {
  const {
    enabled = true,
    open,
    ref,
    onComplete: onCompleteParam
  } = parameters;
  const onComplete = useStableCallback(onCompleteParam);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);
  React15.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    const abortController = new AbortController();
    runOnceAnimationsFinish(onComplete, abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [enabled, open, onComplete, runOnceAnimationsFinish]);
}

// node_modules/@base-ui/react/esm/utils/useTransitionStatus.js
var React16 = __toESM(require_react(), 1);
function useTransitionStatus(open, enableIdleState = false, deferEndingState = false) {
  const [transitionStatus, setTransitionStatus] = React16.useState(open && enableIdleState ? "idle" : void 0);
  const [mounted, setMounted] = React16.useState(open);
  if (open && !mounted) {
    setMounted(true);
    setTransitionStatus("starting");
  }
  if (!open && mounted && transitionStatus !== "ending" && !deferEndingState) {
    setTransitionStatus("ending");
  }
  if (!open && !mounted && transitionStatus === "ending") {
    setTransitionStatus(void 0);
  }
  useIsoLayoutEffect(() => {
    if (!open && mounted && transitionStatus !== "ending" && deferEndingState) {
      const frame = AnimationFrame.request(() => {
        setTransitionStatus("ending");
      });
      return () => {
        AnimationFrame.cancel(frame);
      };
    }
    return void 0;
  }, [open, mounted, transitionStatus, deferEndingState]);
  useIsoLayoutEffect(() => {
    if (!open || enableIdleState) {
      return void 0;
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus(void 0);
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open]);
  useIsoLayoutEffect(() => {
    if (!open || !enableIdleState) {
      return void 0;
    }
    if (open && mounted && transitionStatus !== "idle") {
      setTransitionStatus("starting");
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus("idle");
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open, mounted, transitionStatus]);
  return {
    mounted,
    setMounted,
    transitionStatus
  };
}

// node_modules/@base-ui/react/esm/tabs/panel/TabsPanelDataAttributes.js
var TabsPanelDataAttributes = (function(TabsPanelDataAttributes2) {
  TabsPanelDataAttributes2["index"] = "data-index";
  TabsPanelDataAttributes2["activationDirection"] = "data-activation-direction";
  TabsPanelDataAttributes2["orientation"] = "data-orientation";
  TabsPanelDataAttributes2["hidden"] = "data-hidden";
  TabsPanelDataAttributes2[TabsPanelDataAttributes2["startingStyle"] = TransitionStatusDataAttributes.startingStyle] = "startingStyle";
  TabsPanelDataAttributes2[TabsPanelDataAttributes2["endingStyle"] = TransitionStatusDataAttributes.endingStyle] = "endingStyle";
  return TabsPanelDataAttributes2;
})({});

// node_modules/@base-ui/react/esm/tabs/panel/TabsPanel.js
var stateAttributesMapping2 = {
  ...tabsStateAttributesMapping,
  ...transitionStatusMapping
};
var TabsPanel = React17.forwardRef(function TabPanel(componentProps, forwardedRef) {
  const {
    className,
    value,
    render,
    keepMounted = false,
    style,
    ...elementProps
  } = componentProps;
  const {
    value: selectedValue,
    getTabIdByPanelValue,
    orientation,
    tabActivationDirection,
    registerMountedTabPanel,
    unregisterMountedTabPanel
  } = useTabsRootContext();
  const id = useBaseUiId();
  const metadata = React17.useMemo(() => ({
    id,
    value
  }), [id, value]);
  const {
    ref: listItemRef,
    index
  } = useCompositeListItem({
    metadata
  });
  const open = value === selectedValue;
  const {
    mounted,
    transitionStatus,
    setMounted
  } = useTransitionStatus(open);
  const hidden = !mounted;
  const correspondingTabId = getTabIdByPanelValue(value);
  const state = {
    hidden,
    orientation,
    tabActivationDirection,
    transitionStatus
  };
  const panelRef = React17.useRef(null);
  const element = useRenderElement("div", componentProps, {
    state,
    ref: [forwardedRef, listItemRef, panelRef],
    props: [{
      "aria-labelledby": correspondingTabId,
      hidden,
      id,
      role: "tabpanel",
      tabIndex: open ? 0 : -1,
      inert: inertValue(!open),
      [TabsPanelDataAttributes.index]: index
    }, elementProps],
    stateAttributesMapping: stateAttributesMapping2
  });
  useOpenChangeComplete({
    open,
    ref: panelRef,
    onComplete() {
      if (!open) {
        setMounted(false);
      }
    }
  });
  useIsoLayoutEffect(() => {
    if (hidden && !keepMounted) {
      return void 0;
    }
    if (id == null) {
      return void 0;
    }
    registerMountedTabPanel(value, id);
    return () => {
      unregisterMountedTabPanel(value, id);
    };
  }, [hidden, keepMounted, value, id, registerMountedTabPanel, unregisterMountedTabPanel]);
  const shouldRender = keepMounted || mounted;
  if (!shouldRender) {
    return null;
  }
  return element;
});
if (true) TabsPanel.displayName = "TabsPanel";

// node_modules/@base-ui/react/esm/tabs/list/TabsList.js
var React21 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/composite/root/CompositeRoot.js
var React20 = __toESM(require_react(), 1);

// node_modules/@base-ui/react/esm/composite/root/useCompositeRoot.js
var React18 = __toESM(require_react(), 1);

// node_modules/@base-ui/utils/esm/isElementDisabled.js
function isElementDisabled(element) {
  return element == null || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
}

// node_modules/@base-ui/react/esm/composite/composite.js
var ARROW_UP2 = "ArrowUp";
var ARROW_DOWN2 = "ArrowDown";
var ARROW_LEFT2 = "ArrowLeft";
var ARROW_RIGHT2 = "ArrowRight";
var HOME = "Home";
var END = "End";
var HORIZONTAL_KEYS = /* @__PURE__ */ new Set([ARROW_LEFT2, ARROW_RIGHT2]);
var HORIZONTAL_KEYS_WITH_EXTRA_KEYS = /* @__PURE__ */ new Set([ARROW_LEFT2, ARROW_RIGHT2, HOME, END]);
var VERTICAL_KEYS = /* @__PURE__ */ new Set([ARROW_UP2, ARROW_DOWN2]);
var VERTICAL_KEYS_WITH_EXTRA_KEYS = /* @__PURE__ */ new Set([ARROW_UP2, ARROW_DOWN2, HOME, END]);
var ARROW_KEYS = /* @__PURE__ */ new Set([...HORIZONTAL_KEYS, ...VERTICAL_KEYS]);
var ALL_KEYS = /* @__PURE__ */ new Set([...ARROW_KEYS, HOME, END]);
var SHIFT = "Shift";
var CONTROL = "Control";
var ALT = "Alt";
var META = "Meta";
var MODIFIER_KEYS = /* @__PURE__ */ new Set([SHIFT, CONTROL, ALT, META]);
function isInputElement(element) {
  return isHTMLElement(element) && element.tagName === "INPUT";
}
function isNativeInput(element) {
  if (isInputElement(element) && element.selectionStart != null) {
    return true;
  }
  if (isHTMLElement(element) && element.tagName === "TEXTAREA") {
    return true;
  }
  return false;
}
function scrollIntoViewIfNeeded(scrollContainer, element, direction, orientation) {
  if (!scrollContainer || !element || !element.scrollTo) {
    return;
  }
  let targetX = scrollContainer.scrollLeft;
  let targetY = scrollContainer.scrollTop;
  const isOverflowingX = scrollContainer.clientWidth < scrollContainer.scrollWidth;
  const isOverflowingY = scrollContainer.clientHeight < scrollContainer.scrollHeight;
  if (isOverflowingX && orientation !== "vertical") {
    const elementOffsetLeft = getOffset(scrollContainer, element, "left");
    const containerStyles = getStyles(scrollContainer);
    const elementStyles = getStyles(element);
    if (direction === "ltr") {
      if (elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight > scrollContainer.scrollLeft + scrollContainer.clientWidth - containerStyles.scrollPaddingRight) {
        targetX = elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight - scrollContainer.clientWidth + containerStyles.scrollPaddingRight;
      } else if (elementOffsetLeft - elementStyles.scrollMarginLeft < scrollContainer.scrollLeft + containerStyles.scrollPaddingLeft) {
        targetX = elementOffsetLeft - elementStyles.scrollMarginLeft - containerStyles.scrollPaddingLeft;
      }
    }
    if (direction === "rtl") {
      if (elementOffsetLeft - elementStyles.scrollMarginRight < scrollContainer.scrollLeft + containerStyles.scrollPaddingLeft) {
        targetX = elementOffsetLeft - elementStyles.scrollMarginLeft - containerStyles.scrollPaddingLeft;
      } else if (elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight > scrollContainer.scrollLeft + scrollContainer.clientWidth - containerStyles.scrollPaddingRight) {
        targetX = elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight - scrollContainer.clientWidth + containerStyles.scrollPaddingRight;
      }
    }
  }
  if (isOverflowingY && orientation !== "horizontal") {
    const elementOffsetTop = getOffset(scrollContainer, element, "top");
    const containerStyles = getStyles(scrollContainer);
    const elementStyles = getStyles(element);
    if (elementOffsetTop - elementStyles.scrollMarginTop < scrollContainer.scrollTop + containerStyles.scrollPaddingTop) {
      targetY = elementOffsetTop - elementStyles.scrollMarginTop - containerStyles.scrollPaddingTop;
    } else if (elementOffsetTop + element.offsetHeight + elementStyles.scrollMarginBottom > scrollContainer.scrollTop + scrollContainer.clientHeight - containerStyles.scrollPaddingBottom) {
      targetY = elementOffsetTop + element.offsetHeight + elementStyles.scrollMarginBottom - scrollContainer.clientHeight + containerStyles.scrollPaddingBottom;
    }
  }
  scrollContainer.scrollTo({
    left: targetX,
    top: targetY,
    behavior: "auto"
  });
}
function getOffset(ancestor, element, side) {
  const propName = side === "left" ? "offsetLeft" : "offsetTop";
  let result = 0;
  while (element.offsetParent) {
    result += element[propName];
    if (element.offsetParent === ancestor) {
      break;
    }
    element = element.offsetParent;
  }
  return result;
}
function getStyles(element) {
  const styles = getComputedStyle(element);
  return {
    scrollMarginTop: parseFloat(styles.scrollMarginTop) || 0,
    scrollMarginRight: parseFloat(styles.scrollMarginRight) || 0,
    scrollMarginBottom: parseFloat(styles.scrollMarginBottom) || 0,
    scrollMarginLeft: parseFloat(styles.scrollMarginLeft) || 0,
    scrollPaddingTop: parseFloat(styles.scrollPaddingTop) || 0,
    scrollPaddingRight: parseFloat(styles.scrollPaddingRight) || 0,
    scrollPaddingBottom: parseFloat(styles.scrollPaddingBottom) || 0,
    scrollPaddingLeft: parseFloat(styles.scrollPaddingLeft) || 0
  };
}

// node_modules/@base-ui/react/esm/composite/root/useCompositeRoot.js
var EMPTY_ARRAY2 = [];
function useCompositeRoot(params) {
  const {
    itemSizes,
    cols = 1,
    loopFocus = true,
    onLoop,
    dense = false,
    orientation = "both",
    direction,
    highlightedIndex: externalHighlightedIndex,
    onHighlightedIndexChange: externalSetHighlightedIndex,
    rootRef: externalRef,
    enableHomeAndEndKeys = false,
    stopEventPropagation = false,
    disabledIndices,
    modifierKeys = EMPTY_ARRAY2
  } = params;
  const [internalHighlightedIndex, internalSetHighlightedIndex] = React18.useState(0);
  const isGrid = cols > 1;
  const rootRef = React18.useRef(null);
  const mergedRef = useMergedRefs(rootRef, externalRef);
  const elementsRef = React18.useRef([]);
  const hasSetDefaultIndexRef = React18.useRef(false);
  const highlightedIndex = externalHighlightedIndex ?? internalHighlightedIndex;
  const onHighlightedIndexChange = useStableCallback((index, shouldScrollIntoView = false) => {
    (externalSetHighlightedIndex ?? internalSetHighlightedIndex)(index);
    if (shouldScrollIntoView) {
      const newActiveItem = elementsRef.current[index];
      scrollIntoViewIfNeeded(rootRef.current, newActiveItem, direction, orientation);
    }
  });
  const onMapChange = useStableCallback((map) => {
    if (map.size === 0 || hasSetDefaultIndexRef.current) {
      return;
    }
    hasSetDefaultIndexRef.current = true;
    const sortedElements = Array.from(map.keys());
    const activeItem = sortedElements.find((compositeElement) => compositeElement == null ? void 0 : compositeElement.hasAttribute(ACTIVE_COMPOSITE_ITEM)) ?? null;
    const activeIndex = activeItem ? sortedElements.indexOf(activeItem) : -1;
    if (activeIndex !== -1) {
      onHighlightedIndexChange(activeIndex);
    }
    scrollIntoViewIfNeeded(rootRef.current, activeItem, direction, orientation);
  });
  const wrappedOnLoop = useStableCallback((event, prevIndex, nextIndex) => {
    if (!onLoop) {
      return nextIndex;
    }
    return onLoop == null ? void 0 : onLoop(event, prevIndex, nextIndex, elementsRef);
  });
  const props = React18.useMemo(() => ({
    "aria-orientation": orientation === "both" ? void 0 : orientation,
    ref: mergedRef,
    onFocus(event) {
      const element = rootRef.current;
      const target = getTarget(event.nativeEvent);
      if (!element || target == null || !isNativeInput(target)) {
        return;
      }
      target.setSelectionRange(0, target.value.length ?? 0);
    },
    onKeyDown(event) {
      const RELEVANT_KEYS = enableHomeAndEndKeys ? ALL_KEYS : ARROW_KEYS;
      if (!RELEVANT_KEYS.has(event.key)) {
        return;
      }
      if (isModifierKeySet(event, modifierKeys)) {
        return;
      }
      const element = rootRef.current;
      if (!element) {
        return;
      }
      const isRtl = direction === "rtl";
      const horizontalForwardKey = isRtl ? ARROW_LEFT2 : ARROW_RIGHT2;
      const forwardKey = {
        horizontal: horizontalForwardKey,
        vertical: ARROW_DOWN2,
        both: horizontalForwardKey
      }[orientation];
      const horizontalBackwardKey = isRtl ? ARROW_RIGHT2 : ARROW_LEFT2;
      const backwardKey = {
        horizontal: horizontalBackwardKey,
        vertical: ARROW_UP2,
        both: horizontalBackwardKey
      }[orientation];
      const target = getTarget(event.nativeEvent);
      if (target != null && isNativeInput(target) && !isElementDisabled(target)) {
        const selectionStart = target.selectionStart;
        const selectionEnd = target.selectionEnd;
        const textContent = target.value ?? "";
        if (selectionStart == null || event.shiftKey || selectionStart !== selectionEnd) {
          return;
        }
        if (event.key !== backwardKey && selectionStart < textContent.length) {
          return;
        }
        if (event.key !== forwardKey && selectionStart > 0) {
          return;
        }
      }
      let nextIndex = highlightedIndex;
      const minIndex = getMinListIndex(elementsRef, disabledIndices);
      const maxIndex = getMaxListIndex(elementsRef, disabledIndices);
      if (isGrid) {
        const sizes = itemSizes || Array.from({
          length: elementsRef.current.length
        }, () => ({
          width: 1,
          height: 1
        }));
        const cellMap = createGridCellMap(sizes, cols, dense);
        const minGridIndex = cellMap.findIndex((index) => index != null && !isListIndexDisabled(elementsRef.current, index, disabledIndices));
        const maxGridIndex = cellMap.reduce((foundIndex, index, cellIndex) => index != null && !isListIndexDisabled(elementsRef.current, index, disabledIndices) ? cellIndex : foundIndex, -1);
        nextIndex = cellMap[getGridNavigatedIndex(cellMap.map((itemIndex) => itemIndex != null ? elementsRef.current[itemIndex] : null), {
          event,
          orientation,
          loopFocus,
          onLoop: wrappedOnLoop,
          cols,
          // treat undefined (empty grid spaces) as disabled indices so we
          // don't end up in them
          disabledIndices: getGridCellIndices([...disabledIndices || elementsRef.current.map((_, index) => isListIndexDisabled(elementsRef.current, index) ? index : void 0), void 0], cellMap),
          minIndex: minGridIndex,
          maxIndex: maxGridIndex,
          prevIndex: getGridCellIndexOfCorner(
            highlightedIndex > maxIndex ? minIndex : highlightedIndex,
            sizes,
            cellMap,
            cols,
            // use a corner matching the edge closest to the direction we're
            // moving in so we don't end up in the same item. Prefer
            // top/left over bottom/right.
            // eslint-disable-next-line no-nested-ternary
            event.key === ARROW_DOWN2 ? "bl" : event.key === ARROW_RIGHT2 ? "tr" : "tl"
          ),
          rtl: isRtl
        })];
      }
      const forwardKeys = {
        horizontal: [horizontalForwardKey],
        vertical: [ARROW_DOWN2],
        both: [horizontalForwardKey, ARROW_DOWN2]
      }[orientation];
      const backwardKeys = {
        horizontal: [horizontalBackwardKey],
        vertical: [ARROW_UP2],
        both: [horizontalBackwardKey, ARROW_UP2]
      }[orientation];
      const preventedKeys = isGrid ? RELEVANT_KEYS : {
        horizontal: enableHomeAndEndKeys ? HORIZONTAL_KEYS_WITH_EXTRA_KEYS : HORIZONTAL_KEYS,
        vertical: enableHomeAndEndKeys ? VERTICAL_KEYS_WITH_EXTRA_KEYS : VERTICAL_KEYS,
        both: RELEVANT_KEYS
      }[orientation];
      if (enableHomeAndEndKeys) {
        if (event.key === HOME) {
          nextIndex = minIndex;
        } else if (event.key === END) {
          nextIndex = maxIndex;
        }
      }
      if (nextIndex === highlightedIndex && (forwardKeys.includes(event.key) || backwardKeys.includes(event.key))) {
        if (loopFocus && nextIndex === maxIndex && forwardKeys.includes(event.key)) {
          nextIndex = minIndex;
          if (onLoop) {
            nextIndex = onLoop(event, highlightedIndex, nextIndex, elementsRef);
          }
        } else if (loopFocus && nextIndex === minIndex && backwardKeys.includes(event.key)) {
          nextIndex = maxIndex;
          if (onLoop) {
            nextIndex = onLoop(event, highlightedIndex, nextIndex, elementsRef);
          }
        } else {
          nextIndex = findNonDisabledListIndex(elementsRef.current, {
            startingIndex: nextIndex,
            decrement: backwardKeys.includes(event.key),
            disabledIndices
          });
        }
      }
      if (nextIndex !== highlightedIndex && !isIndexOutOfListBounds(elementsRef.current, nextIndex)) {
        if (stopEventPropagation) {
          event.stopPropagation();
        }
        if (preventedKeys.has(event.key)) {
          event.preventDefault();
        }
        onHighlightedIndexChange(nextIndex, true);
        queueMicrotask(() => {
          var _a;
          (_a = elementsRef.current[nextIndex]) == null ? void 0 : _a.focus();
        });
      }
    }
  }), [cols, dense, direction, disabledIndices, elementsRef, enableHomeAndEndKeys, highlightedIndex, isGrid, itemSizes, loopFocus, onLoop, wrappedOnLoop, mergedRef, modifierKeys, onHighlightedIndexChange, orientation, stopEventPropagation]);
  return React18.useMemo(() => ({
    props,
    highlightedIndex,
    onHighlightedIndexChange,
    elementsRef,
    disabledIndices,
    onMapChange,
    relayKeyboardEvent: props.onKeyDown
  }), [props, highlightedIndex, onHighlightedIndexChange, elementsRef, disabledIndices, onMapChange]);
}
function isModifierKeySet(event, ignoredModifierKeys) {
  for (const key of MODIFIER_KEYS.values()) {
    if (ignoredModifierKeys.includes(key)) {
      continue;
    }
    if (event.getModifierState(key)) {
      return true;
    }
  }
  return false;
}

// node_modules/@base-ui/react/esm/direction-provider/DirectionContext.js
var React19 = __toESM(require_react(), 1);
var DirectionContext = React19.createContext(void 0);
if (true) DirectionContext.displayName = "DirectionContext";
function useDirection() {
  const context = React19.useContext(DirectionContext);
  return (context == null ? void 0 : context.direction) ?? "ltr";
}

// node_modules/@base-ui/react/esm/composite/root/CompositeRoot.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
function CompositeRoot(componentProps) {
  const {
    render,
    className,
    style,
    refs = EMPTY_ARRAY,
    props = EMPTY_ARRAY,
    state = EMPTY_OBJECT,
    stateAttributesMapping: stateAttributesMapping3,
    highlightedIndex: highlightedIndexProp,
    onHighlightedIndexChange: onHighlightedIndexChangeProp,
    orientation,
    dense,
    itemSizes,
    loopFocus,
    onLoop,
    cols,
    enableHomeAndEndKeys,
    onMapChange: onMapChangeProp,
    stopEventPropagation = true,
    rootRef,
    disabledIndices,
    modifierKeys,
    highlightItemOnHover = false,
    tag = "div",
    ...elementProps
  } = componentProps;
  const direction = useDirection();
  const {
    props: defaultProps,
    highlightedIndex,
    onHighlightedIndexChange,
    elementsRef,
    onMapChange: onMapChangeUnwrapped,
    relayKeyboardEvent
  } = useCompositeRoot({
    itemSizes,
    cols,
    loopFocus,
    onLoop,
    dense,
    orientation,
    highlightedIndex: highlightedIndexProp,
    onHighlightedIndexChange: onHighlightedIndexChangeProp,
    rootRef,
    stopEventPropagation,
    enableHomeAndEndKeys,
    direction,
    disabledIndices,
    modifierKeys
  });
  const element = useRenderElement(tag, componentProps, {
    state,
    ref: refs,
    props: [defaultProps, ...props, elementProps],
    stateAttributesMapping: stateAttributesMapping3
  });
  const contextValue = React20.useMemo(() => ({
    highlightedIndex,
    onHighlightedIndexChange,
    highlightItemOnHover,
    relayKeyboardEvent
  }), [highlightedIndex, onHighlightedIndexChange, highlightItemOnHover, relayKeyboardEvent]);
  return (0, import_jsx_runtime4.jsx)(CompositeRootContext.Provider, {
    value: contextValue,
    children: (0, import_jsx_runtime4.jsx)(CompositeList, {
      elementsRef,
      onMapChange: (newMap) => {
        onMapChangeProp == null ? void 0 : onMapChangeProp(newMap);
        onMapChangeUnwrapped(newMap);
      },
      children: element
    })
  });
}

// node_modules/@base-ui/react/esm/tabs/list/TabsList.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var TabsList = React21.forwardRef(function TabsList2(componentProps, forwardedRef) {
  const {
    activateOnFocus = false,
    className,
    loopFocus = true,
    render,
    style,
    ...elementProps
  } = componentProps;
  const {
    onValueChange,
    orientation,
    value,
    setTabMap,
    tabActivationDirection
  } = useTabsRootContext();
  const [highlightedTabIndex, setHighlightedTabIndex] = React21.useState(0);
  const [tabsListElement, setTabsListElement] = React21.useState(null);
  const indicatorUpdateListenersRef = React21.useRef(/* @__PURE__ */ new Set());
  const tabResizeObserverElementsRef = React21.useRef(/* @__PURE__ */ new Set());
  const resizeObserverRef = React21.useRef(null);
  const notifyIndicatorUpdateListeners = useStableCallback(() => {
    indicatorUpdateListenersRef.current.forEach((listener) => {
      listener();
    });
  });
  React21.useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      return void 0;
    }
    const resizeObserver = new ResizeObserver(() => {
      if (!indicatorUpdateListenersRef.current.size) {
        return;
      }
      notifyIndicatorUpdateListeners();
    });
    resizeObserverRef.current = resizeObserver;
    if (tabsListElement) {
      resizeObserver.observe(tabsListElement);
    }
    tabResizeObserverElementsRef.current.forEach((element) => {
      resizeObserver.observe(element);
    });
    return () => {
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
    };
  }, [tabsListElement, notifyIndicatorUpdateListeners]);
  const registerIndicatorUpdateListener = useStableCallback((listener) => {
    indicatorUpdateListenersRef.current.add(listener);
    return () => {
      indicatorUpdateListenersRef.current.delete(listener);
    };
  });
  const registerTabResizeObserverElement = useStableCallback((element) => {
    var _a;
    tabResizeObserverElementsRef.current.add(element);
    (_a = resizeObserverRef.current) == null ? void 0 : _a.observe(element);
    return () => {
      var _a2;
      tabResizeObserverElementsRef.current.delete(element);
      (_a2 = resizeObserverRef.current) == null ? void 0 : _a2.unobserve(element);
    };
  });
  const onTabActivation = useStableCallback((newValue, eventDetails) => {
    if (newValue !== value) {
      onValueChange(newValue, eventDetails);
    }
  });
  const state = {
    orientation,
    tabActivationDirection
  };
  const defaultProps = {
    "aria-orientation": orientation === "vertical" ? "vertical" : void 0,
    role: "tablist"
  };
  const tabsListContextValue = React21.useMemo(() => ({
    activateOnFocus,
    highlightedTabIndex,
    registerIndicatorUpdateListener,
    registerTabResizeObserverElement,
    onTabActivation,
    setHighlightedTabIndex,
    tabsListElement
  }), [activateOnFocus, highlightedTabIndex, registerIndicatorUpdateListener, registerTabResizeObserverElement, onTabActivation, setHighlightedTabIndex, tabsListElement]);
  return (0, import_jsx_runtime5.jsx)(TabsListContext.Provider, {
    value: tabsListContextValue,
    children: (0, import_jsx_runtime5.jsx)(CompositeRoot, {
      render,
      className,
      style,
      state,
      refs: [forwardedRef, setTabsListElement],
      props: [defaultProps, elementProps],
      stateAttributesMapping: tabsStateAttributesMapping,
      highlightedIndex: highlightedTabIndex,
      enableHomeAndEndKeys: true,
      loopFocus,
      orientation,
      onHighlightedIndexChange: setHighlightedTabIndex,
      onMapChange: setTabMap,
      disabledIndices: EMPTY_ARRAY
    })
  });
});
if (true) TabsList.displayName = "TabsList";
export {
  index_parts_exports as Tabs
};
//# sourceMappingURL=@base-ui_react_tabs.js.map

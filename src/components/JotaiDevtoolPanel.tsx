// from: https://github.com/jotaijs/jotai-devtools/discussions/202#discussioncomment-17032330
import { createStore, useStore } from 'jotai';
import { DevTools, type DevToolsProps } from 'jotai-devtools';

const css = `
  /* Override Jotai Devtools shell styles so it fills the available space and is not fixed-positioned */
  .jotai-devtools-panel #jotai-devtools-shell {
    display: block;
    width: 100% !important;
    height: 100% !important;
    position: unset !important;
    max-height: unset !important;
    max-width: unset !important;
    transform: unset !important;
    border-color: unset !important;
  }
  /* Hide the shell resize handle */
  .jotai-devtools-panel #jotai-devtools-shell > div:nth-child(1) {
    display: none !important;
  }
  /* Make the title area more compact */
  .jotai-devtools-panel #jotai-devtools-shell > div:nth-child(2) > div {
    margin: 0 !important;
    padding: 5px 10px !important;
  }
  .jotai-devtools-panel #jotai-devtools-shell > div:nth-child(2) > div h1 {
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
  }
  /* Hide the theme toggle and close buttons */
  .jotai-devtools-panel #jotai-devtools-shell > div:nth-child(2) button {
    display: none !important;
  }
`;

export function JotaiDevtoolsPanel({
  theme,
}: {
  store: ReturnType<typeof createStore>;
  theme: DevToolsProps['theme'];
}) {
  const store = useStore();
  return (
    <div className="jotai-devtools-panel" style={{ display: 'block', width: '100%', height: '100%' }}>
      <style>{css}</style>
      <DevTools store={store} isInitialOpen theme={theme} />
    </div>
  );
}

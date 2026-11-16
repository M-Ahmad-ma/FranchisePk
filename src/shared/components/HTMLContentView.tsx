import { useMemo, useState } from 'react';
import {
  View,
  Text,
  Linking,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
  type LayoutChangeEvent,
} from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

interface HTMLContentViewProps {
  html: string;
  collapsed?: boolean;
  collapsedHeight?: number;
  style?: StyleProp<ViewStyle>;
}

function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/\\"/g, '"')
    .replace(/<(\/?[a-z][a-z0-9]*)\s[^>]*>/gi, '<$1>')
    .replace(/\\+/g, '');
}

const BASE_CSS = `
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    font-family: -apple-system, 'Lato', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: #1F2437;
    -webkit-text-size-adjust: 100%;
  }
  #root { width: 100%; }
  p { margin: 0 0 10px; }
  strong, b { font-weight: 700; color: #1F2437; }
  em, i { font-style: italic; }
  a { color: #5279AC; text-decoration: none; }
  ul, ol { padding-left: 20px; margin: 0 0 10px; }
  li { margin-bottom: 4px; }
  h1, h2, h3, h4 { color: #1F2437; font-weight: 700; line-height: 1.3; margin: 14px 0 8px; }
  h1 { font-size: 20px; } h2 { font-size: 18px; } h3 { font-size: 16px; } h4 { font-size: 15px; }
  img { max-width: 100%; height: auto; border-radius: 8px; }
  hr { border: 0; border-top: 1px solid #E5E9F5; margin: 12px 0; }
`;

export function HTMLContentView({
  html,
  collapsed,
  collapsedHeight = 180,
  style,
}: HTMLContentViewProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutWidth, setLayoutWidth] = useState(0);

  const content = useMemo(() => sanitizeHtml(html), [html]);
  const isPlainText = !content.includes('<');

  // Only accept a height once the WebView has a real, settled width.
  const contentLength = content.length;
  const onMessage = (e: WebViewMessageEvent) => {
    const raw = Number(e.nativeEvent.data);
    if (!Number.isFinite(raw) || raw <= 0) {
      return;
    }
    if (raw > contentLength * 2 + 400) {
      return;
    }
    setContentHeight((prev) => Math.max(prev, raw));
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== layoutWidth) setLayoutWidth(w);
  };

  const webHtml = useMemo(() => {
    // No console.* in this script: it runs in the WebView, so the release
    // minifier cannot strip it and it would surface in logcat via the chromium
    // console bridge.
    const measureJs = `
      function reportHeight() {
        var w = window.innerWidth;
        var root = document.getElementById('root');
        var oh = root ? root.offsetHeight : 0;
        var bh = document.body ? document.body.offsetHeight : 0;
        var dsh = document.documentElement ? document.documentElement.scrollHeight : 0;
        var h = oh || bh || dsh || 1;
        h = Math.max(Math.round(h), 1);
        window.ReactNativeWebView.postMessage(String(h));
      }
      if (document.readyState === 'complete') {
        reportHeight();
      } else {
        document.addEventListener('DOMContentLoaded', function(){ reportHeight(); });
        window.addEventListener('load', function(){ reportHeight(); });
      }
      setTimeout(reportHeight, 50);
      setTimeout(reportHeight, 150);
      setTimeout(reportHeight, 400);
    `;
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>${BASE_CSS}</style>
        </head>
        <body><div id="root">${content}</div></body>
        <script>${measureJs}</script>
      </html>
    `;
  }, [content]);

  if (isPlainText) {
    return (
      <View style={[{ overflow: 'hidden' }, collapsed && { maxHeight: collapsedHeight }, style]}>
        <Text className="text-neutral-900 text-base font-lato leading-6">
          {content.trim()}
        </Text>
      </View>
    );
  }

  const fallbackWidth = screenWidth - 40;
  const width = layoutWidth > 0 ? layoutWidth : fallbackWidth;

  // sensible fallback if measurement hasn't fired yet, or measured + buffer
  const minEstimate = Math.max(collapsedHeight, Math.ceil(contentLength * 0.35) + 60);
  const measuredHeight =
    contentHeight > 0 ? contentHeight + 16 : minEstimate;
  const displayedHeight = collapsed
    ? Math.min(measuredHeight, collapsedHeight)
    : measuredHeight;

  return (
    <View
      onLayout={onLayout}
      key={collapsed ? 'collapsed' : 'expanded'}
      style={[{ height: displayedHeight, overflow: 'hidden' }, style]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html: webHtml }}
        containerStyle={{ width, height: displayedHeight }}
        style={{ width, backgroundColor: 'transparent' }}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled
        domStorageEnabled
        textZoom={100}
        setBuiltInZoomControls={false}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={(request) => {
          const { url } = request;
          if (url.startsWith('http')) {
            Linking.openURL(url).catch(() => { });
            return false;
          }
          return true;
        }}
        setSupportMultipleWindows={false}
      />
    </View>
  );
}

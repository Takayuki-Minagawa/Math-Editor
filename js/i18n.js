window.MathEditor = window.MathEditor || {};

window.MathEditor.i18n = (function () {
  var currentLang = "ja";

  // ===== UI translations =====
  var ui = {
    ja: {
      title: "数式エディタ",
      editorLabel: "LaTeX入力",
      editorPlaceholder: "ここにLaTeXを入力、またはツールバーのボタンをクリック...",
      previewLabel: "プレビュー",
      previewPlaceholder: "ここにプレビューが表示されます",
      renderError: "レンダリングエラー",
      btnCopy: "LaTeXをコピー",
      btnCopyImage: "画像をコピー",
      btnSave: "Markdownで保存",
      btnSaveImage: "画像を保存",
      btnClear: "クリア",
      toastCopied: "LaTeXをコピーしました",
      toastImageCopied: "画像をコピーしました",
      toastImageCopyFailed: "画像のコピーに失敗しました",
      toastCopyFailed: "コピーに失敗しました",
      toastSaved: "Markdownファイルを保存しました",
      toastImageSaved: "画像を保存しました",
      toastNoPreview: "プレビューがありません",
      langBtn: "EN",
      guideTitle: "使い方ガイド",
      footerLicense: "本アプリケーションは MIT License で公開されています。"
    },
    en: {
      title: "Math Equation Editor",
      editorLabel: "LaTeX Input",
      editorPlaceholder: "Type LaTeX here, or click a toolbar button...",
      previewLabel: "Preview",
      previewPlaceholder: "Preview will appear here",
      renderError: "Rendering error",
      btnCopy: "Copy LaTeX",
      btnCopyImage: "Copy Image",
      btnSave: "Save as Markdown",
      btnSaveImage: "Save Image",
      btnClear: "Clear",
      toastCopied: "LaTeX copied to clipboard",
      toastImageCopied: "Image copied to clipboard",
      toastImageCopyFailed: "Failed to copy image",
      toastCopyFailed: "Failed to copy",
      toastSaved: "Markdown file saved",
      toastImageSaved: "Image saved",
      toastNoPreview: "No preview available",
      langBtn: "JA",
      guideTitle: "User Guide",
      footerLicense: "This application is released under the MIT License."
    }
  };

  // ===== Guide HTML =====
  var guideHtml = {
    ja: '<h3>基本操作</h3>'
      + '<table><thead><tr><th>操作</th><th>説明</th></tr></thead><tbody>'
      + '<tr><td>ツールバーのボタンをクリック</td><td>LaTeX コマンドがカーソル位置に挿入されます</td></tr>'
      + '<tr><td>書式タブで色を選択</td><td>カラーパレットから文字色・背景色を選んで挿入できます</td></tr>'
      + '<tr><td>入力エリアに直接入力・貼り付け</td><td>LaTeX を直接記述できます</td></tr>'
      + '<tr><td>Ctrl+Z / Cmd+Z</td><td>元に戻す（Undo）</td></tr>'
      + '</tbody></table>'
      + '<h3>出力</h3>'
      + '<table><thead><tr><th>ボタン</th><th>機能</th></tr></thead><tbody>'
      + '<tr><td><strong>LaTeXをコピー</strong></td><td>LaTeX 文字列をクリップボードにコピー</td></tr>'
      + '<tr><td><strong>画像をコピー</strong></td><td>プレビュー画像（PNG）をクリップボードにコピー</td></tr>'
      + '<tr><td><strong>Markdownで保存</strong></td><td><code>$$...$$</code> で囲んだ .md ファイルをダウンロード</td></tr>'
      + '<tr><td><strong>画像を保存</strong></td><td>プレビュー画像を PNG ファイルとしてダウンロード</td></tr>'
      + '<tr><td><strong>クリア</strong></td><td>入力エリアとプレビューをリセット</td></tr>'
      + '</tbody></table>'
      + '<h3>入力例</h3>'
      + '<table><thead><tr><th>LaTeX</th><th>説明</th></tr></thead><tbody>'
      + '<tr><td><code>\\frac{a}{b}</code></td><td>分数 a/b</td></tr>'
      + '<tr><td><code>x^{2} + y^{2} = r^{2}</code></td><td>上付き文字（べき乗）</td></tr>'
      + '<tr><td><code>\\sum_{i=1}^{n} a_i</code></td><td>総和記号</td></tr>'
      + '<tr><td><code>\\int_{0}^{\\infty} e^{-x} dx</code></td><td>積分</td></tr>'
      + '<tr><td><code>\\sqrt{x^2 + y^2}</code></td><td>平方根</td></tr>'
      + '<tr><td><code>\\begin{pmatrix} a &amp; b \\\\ c &amp; d \\end{pmatrix}</code></td><td>2x2 行列</td></tr>'
      + '<tr><td><code>\\textcolor{blue}{x+y}</code></td><td>文字色を変更</td></tr>'
      + '<tr><td><code>\\boxed{E=mc^2}</code></td><td>数式を枠で囲む</td></tr>'
      + '</tbody></table>'
      + '<h3>ヒント</h3>'
      + '<ul>'
      + '<li>プレビューはリアルタイムで更新されます</li>'
      + '<li>構造ボタン（分数・上付きなど）はカーソルを自動的に入力位置に移動します</li>'
      + '<li>囲み枠・取消線・色付けは、選択中のテキストをそのままラップして挿入できます</li>'
      + '<li>ボタンにマウスを合わせるとツールチップで名前が表示されます</li>'
      + '<li>右上の <strong>EN</strong> ボタンで英語に切り替えられます</li>'
      + '</ul>',
    en: '<h3>Basic Usage</h3>'
      + '<table><thead><tr><th>Action</th><th>Description</th></tr></thead><tbody>'
      + '<tr><td>Click a toolbar button</td><td>Inserts the LaTeX command at the cursor position</td></tr>'
      + '<tr><td>Choose a color in the Formatting tab</td><td>Insert text color or background color from the color palette</td></tr>'
      + '<tr><td>Type or paste into the input area</td><td>You can write LaTeX directly</td></tr>'
      + '<tr><td>Ctrl+Z / Cmd+Z</td><td>Undo</td></tr>'
      + '</tbody></table>'
      + '<h3>Output</h3>'
      + '<table><thead><tr><th>Button</th><th>Function</th></tr></thead><tbody>'
      + '<tr><td><strong>Copy LaTeX</strong></td><td>Copies the LaTeX string to the clipboard</td></tr>'
      + '<tr><td><strong>Copy Image</strong></td><td>Copies the preview image (PNG) to the clipboard</td></tr>'
      + '<tr><td><strong>Save as Markdown</strong></td><td>Downloads a .md file wrapped in <code>$$...$$</code></td></tr>'
      + '<tr><td><strong>Save Image</strong></td><td>Downloads the preview as a PNG image file</td></tr>'
      + '<tr><td><strong>Clear</strong></td><td>Resets the input area and preview</td></tr>'
      + '</tbody></table>'
      + '<h3>Examples</h3>'
      + '<table><thead><tr><th>LaTeX</th><th>Description</th></tr></thead><tbody>'
      + '<tr><td><code>\\frac{a}{b}</code></td><td>Fraction a/b</td></tr>'
      + '<tr><td><code>x^{2} + y^{2} = r^{2}</code></td><td>Superscript (exponent)</td></tr>'
      + '<tr><td><code>\\sum_{i=1}^{n} a_i</code></td><td>Summation</td></tr>'
      + '<tr><td><code>\\int_{0}^{\\infty} e^{-x} dx</code></td><td>Integral</td></tr>'
      + '<tr><td><code>\\sqrt{x^2 + y^2}</code></td><td>Square root</td></tr>'
      + '<tr><td><code>\\begin{pmatrix} a &amp; b \\\\ c &amp; d \\end{pmatrix}</code></td><td>2x2 matrix</td></tr>'
      + '<tr><td><code>\\textcolor{blue}{x+y}</code></td><td>Change text color</td></tr>'
      + '<tr><td><code>\\boxed{E=mc^2}</code></td><td>Wrap the formula in a box</td></tr>'
      + '</tbody></table>'
      + '<h3>Tips</h3>'
      + '<ul>'
      + '<li>The preview updates in real time as you type</li>'
      + '<li>Structure buttons (fraction, superscript, etc.) automatically place the cursor at the input position</li>'
      + '<li>Box, cancel, and color actions can wrap the currently selected text</li>'
      + '<li>Hover over buttons to see their names in tooltips</li>'
      + '<li>Click the <strong>JA</strong> button in the top-right corner to switch to Japanese</li>'
      + '</ul>'
  };

  // ===== Toolbar label translations =====
  var toolbarLabels = {
    ja: {
      "greek": "ギリシャ文字",
      "operators": "演算子",
      "relations": "関係",
      "structures": "構造",
      "large-ops": "大型演算子",
      "matrices": "行列",
      "brackets": "括弧",
      "arrows": "矢印",
      "functions": "関数",
      "accents": "装飾",
      "formatting": "書式",
      "misc": "その他"
    },
    en: {
      "greek": "Greek",
      "operators": "Operators",
      "relations": "Relations",
      "structures": "Structures",
      "large-ops": "Large Ops",
      "matrices": "Matrices",
      "brackets": "Brackets",
      "arrows": "Arrows",
      "functions": "Functions",
      "accents": "Accents",
      "formatting": "Formatting",
      "misc": "Misc"
    }
  };

  // ===== Tooltip translations =====
  var tooltips = {
    ja: {
      // Greek
      "\\alpha": "アルファ (alpha)", "\\beta": "ベータ (beta)", "\\gamma": "ガンマ (gamma)",
      "\\delta": "デルタ (delta)", "\\epsilon": "イプシロン (epsilon)", "\\zeta": "ゼータ (zeta)",
      "\\eta": "エータ (eta)", "\\theta": "シータ (theta)", "\\iota": "イオタ (iota)",
      "\\kappa": "カッパ (kappa)", "\\lambda": "ラムダ (lambda)", "\\mu": "ミュー (mu)",
      "\\nu": "ニュー (nu)", "\\xi": "クシー (xi)", "\\pi": "パイ (pi)",
      "\\rho": "ロー (rho)", "\\sigma": "シグマ (sigma)", "\\tau": "タウ (tau)",
      "\\upsilon": "ウプシロン (upsilon)", "\\phi": "ファイ (phi)", "\\chi": "カイ (chi)",
      "\\psi": "プサイ (psi)", "\\omega": "オメガ (omega)",
      "\\Gamma": "ガンマ (大文字)", "\\Delta": "デルタ (大文字)", "\\Theta": "シータ (大文字)",
      "\\Lambda": "ラムダ (大文字)", "\\Xi": "クシー (大文字)", "\\Pi": "パイ (大文字)",
      "\\Sigma": "シグマ (大文字)", "\\Phi": "ファイ (大文字)", "\\Psi": "プサイ (大文字)",
      "\\Omega": "オメガ (大文字)",
      // Operators
      "+": "足す", "-": "引く", "\\times": "掛ける", "\\div": "割る",
      "\\pm": "プラスマイナス", "\\mp": "マイナスプラス", "\\cdot": "ドット積",
      "\\ast": "アスタリスク", "\\oplus": "直和", "\\otimes": "テンソル積", "\\circ": "合成",
      // Relations
      "=": "等号", "\\neq": "等しくない", "<": "小なり", ">": "大なり",
      "\\leq": "以下", "\\geq": "以上", "\\ll": "非常に小さい", "\\gg": "非常に大きい",
      "\\approx": "近似", "\\equiv": "合同", "\\sim": "類似", "\\simeq": "漸近的に等しい",
      "\\propto": "比例", "\\subset": "部分集合", "\\supset": "上位集合",
      "\\subseteq": "部分集合 (等号含む)", "\\supseteq": "上位集合 (等号含む)",
      "\\in": "属する", "\\notin": "属さない", "\\ni": "含む",
      // Structures
      "^{}": "上付き文字", "_{}": "下付き文字", "_{}^{}": "下付き+上付き",
      "\\frac{}{}": "分数", "\\sqrt{}": "平方根", "\\sqrt[]{}": "n乗根",
      "\\binom{}{}": "二項係数", "\\overline{}": "上線", "\\underline{}": "下線",
      // Large ops
      "\\sum_{}^{}": "総和", "\\prod_{}^{}": "総乗", "\\coprod_{}^{}": "余積",
      "\\int_{}^{}": "積分", "\\iint": "二重積分", "\\iiint": "三重積分",
      "\\oint": "周回積分", "\\lim_{}": "極限",
      "\\bigcup_{}^{}": "和集合", "\\bigcap_{}^{}": "積集合",
      // Arrows
      "\\rightarrow": "右矢印", "\\leftarrow": "左矢印", "\\leftrightarrow": "左右矢印",
      "\\Rightarrow": "右二重矢印", "\\Leftarrow": "左二重矢印", "\\Leftrightarrow": "左右二重矢印",
      "\\mapsto": "写像", "\\implies": "ならば", "\\iff": "同値",
      "\\uparrow": "上矢印", "\\downarrow": "下矢印",
      "\\Uparrow": "上二重矢印", "\\Downarrow": "下二重矢印",
      "\\nearrow": "右上矢印", "\\searrow": "右下矢印",
      // Functions
      "\\sin": "サイン", "\\cos": "コサイン", "\\tan": "タンジェント",
      "\\sec": "セカント", "\\csc": "コセカント", "\\cot": "コタンジェント",
      "\\arcsin": "アークサイン", "\\arccos": "アークコサイン", "\\arctan": "アークタンジェント",
      "\\sinh": "双曲線サイン", "\\cosh": "双曲線コサイン", "\\tanh": "双曲線タンジェント",
      "\\log": "対数", "\\ln": "自然対数", "\\exp": "指数", "\\lim": "極限",
      "\\min": "最小値", "\\max": "最大値", "\\det": "行列式", "\\gcd": "最大公約数",
      "\\inf": "下限", "\\sup": "上限", "\\dim": "次元", "\\ker": "核",
      // Accents
      "\\hat{}": "ハット", "\\check{}": "チェック", "\\bar{}": "バー",
      "\\dot{}": "ドット", "\\ddot{}": "ダブルドット", "\\vec{}": "ベクトル",
      "\\tilde{}": "チルダ", "\\breve{}": "ブレーヴ", "\\acute{}": "アキュート",
      "\\grave{}": "グレイヴ", "\\overbrace{}": "上波括弧", "\\underbrace{}": "下波括弧",
      "\\overrightarrow{}": "上矢印", "\\overleftarrow{}": "上左矢印",
      "\\widehat{}": "ワイドハット", "\\widetilde{}": "ワイドチルダ",
      // Formatting
      "textcolor": "文字色", "bgcolor": "背景色",
      "\\cancel{}": "取消線 (左下→右上)", "\\bcancel{}": "逆取消線 (左上→右下)",
      "\\xcancel{}": "×取消線", "\\boxed{}": "囲み枠",
      // Brackets
      "\\left( \\right)": "丸括弧", "\\left[ \\right]": "角括弧",
      "\\left\\{ \\right\\}": "波括弧", "\\left\\langle \\right\\rangle": "山括弧",
      "\\left| \\right|": "絶対値", "\\left\\| \\right\\|": "ノルム",
      "\\left\\lceil \\right\\rceil": "天井関数", "\\left\\lfloor \\right\\rfloor": "床関数",
      // Misc
      "\\infty": "無限大", "\\partial": "偏微分", "\\nabla": "ナブラ",
      "\\emptyset": "空集合", "\\forall": "全称", "\\exists": "存在",
      "\\neg": "否定", "\\land": "論理積 (AND)", "\\lor": "論理和 (OR)",
      "\\perp": "直交", "\\angle": "角度", "\\triangle": "三角形", "\\square": "四角形",
      "\\mathbb{R}": "実数", "\\mathbb{Z}": "整数", "\\mathbb{N}": "自然数",
      "\\mathbb{C}": "複素数", "\\mathbb{Q}": "有理数",
      "\\dots": "ドット (水平)", "\\cdots": "ドット (中央)",
      "\\vdots": "ドット (垂直)", "\\ddots": "ドット (斜め)",
      "\\quad": "スペース (広)", "\\,": "スペース (狭)",
      "\\text{}": "テキストモード", "\\mathbf{}": "太字",
      "\\mathit{}": "斜体", "\\mathcal{}": "カリグラフィ体"
    },
    en: {
      // Greek
      "\\alpha": "Alpha", "\\beta": "Beta", "\\gamma": "Gamma",
      "\\delta": "Delta", "\\epsilon": "Epsilon", "\\zeta": "Zeta",
      "\\eta": "Eta", "\\theta": "Theta", "\\iota": "Iota",
      "\\kappa": "Kappa", "\\lambda": "Lambda", "\\mu": "Mu",
      "\\nu": "Nu", "\\xi": "Xi", "\\pi": "Pi",
      "\\rho": "Rho", "\\sigma": "Sigma", "\\tau": "Tau",
      "\\upsilon": "Upsilon", "\\phi": "Phi", "\\chi": "Chi",
      "\\psi": "Psi", "\\omega": "Omega",
      "\\Gamma": "Gamma (upper)", "\\Delta": "Delta (upper)", "\\Theta": "Theta (upper)",
      "\\Lambda": "Lambda (upper)", "\\Xi": "Xi (upper)", "\\Pi": "Pi (upper)",
      "\\Sigma": "Sigma (upper)", "\\Phi": "Phi (upper)", "\\Psi": "Psi (upper)",
      "\\Omega": "Omega (upper)",
      // Operators
      "+": "Plus", "-": "Minus", "\\times": "Times", "\\div": "Division",
      "\\pm": "Plus-minus", "\\mp": "Minus-plus", "\\cdot": "Dot product",
      "\\ast": "Asterisk", "\\oplus": "Direct sum", "\\otimes": "Tensor product", "\\circ": "Composition",
      // Relations
      "=": "Equals", "\\neq": "Not equal", "<": "Less than", ">": "Greater than",
      "\\leq": "Less or equal", "\\geq": "Greater or equal",
      "\\ll": "Much less than", "\\gg": "Much greater than",
      "\\approx": "Approximately", "\\equiv": "Congruent", "\\sim": "Similar",
      "\\simeq": "Asymptotically equal", "\\propto": "Proportional",
      "\\subset": "Subset", "\\supset": "Superset",
      "\\subseteq": "Subset or equal", "\\supseteq": "Superset or equal",
      "\\in": "Element of", "\\notin": "Not element of", "\\ni": "Contains",
      // Structures
      "^{}": "Superscript", "_{}": "Subscript", "_{}^{}": "Sub + superscript",
      "\\frac{}{}": "Fraction", "\\sqrt{}": "Square root", "\\sqrt[]{}": "Nth root",
      "\\binom{}{}": "Binomial", "\\overline{}": "Overline", "\\underline{}": "Underline",
      // Large ops
      "\\sum_{}^{}": "Summation", "\\prod_{}^{}": "Product", "\\coprod_{}^{}": "Coproduct",
      "\\int_{}^{}": "Integral", "\\iint": "Double integral", "\\iiint": "Triple integral",
      "\\oint": "Contour integral", "\\lim_{}": "Limit",
      "\\bigcup_{}^{}": "Union", "\\bigcap_{}^{}": "Intersection",
      // Arrows
      "\\rightarrow": "Right arrow", "\\leftarrow": "Left arrow",
      "\\leftrightarrow": "Left-right arrow",
      "\\Rightarrow": "Double right arrow", "\\Leftarrow": "Double left arrow",
      "\\Leftrightarrow": "Double left-right arrow",
      "\\mapsto": "Maps to", "\\implies": "Implies", "\\iff": "If and only if",
      "\\uparrow": "Up arrow", "\\downarrow": "Down arrow",
      "\\Uparrow": "Double up arrow", "\\Downarrow": "Double down arrow",
      "\\nearrow": "Northeast arrow", "\\searrow": "Southeast arrow",
      // Functions
      "\\sin": "Sine", "\\cos": "Cosine", "\\tan": "Tangent",
      "\\sec": "Secant", "\\csc": "Cosecant", "\\cot": "Cotangent",
      "\\arcsin": "Arcsine", "\\arccos": "Arccosine", "\\arctan": "Arctangent",
      "\\sinh": "Hyperbolic sine", "\\cosh": "Hyperbolic cosine", "\\tanh": "Hyperbolic tangent",
      "\\log": "Logarithm", "\\ln": "Natural log", "\\exp": "Exponential", "\\lim": "Limit",
      "\\min": "Minimum", "\\max": "Maximum", "\\det": "Determinant", "\\gcd": "GCD",
      "\\inf": "Infimum", "\\sup": "Supremum", "\\dim": "Dimension", "\\ker": "Kernel",
      // Accents
      "\\hat{}": "Hat", "\\check{}": "Check", "\\bar{}": "Bar",
      "\\dot{}": "Dot", "\\ddot{}": "Double dot", "\\vec{}": "Vector",
      "\\tilde{}": "Tilde", "\\breve{}": "Breve", "\\acute{}": "Acute",
      "\\grave{}": "Grave", "\\overbrace{}": "Overbrace", "\\underbrace{}": "Underbrace",
      "\\overrightarrow{}": "Right arrow above", "\\overleftarrow{}": "Left arrow above",
      "\\widehat{}": "Wide hat", "\\widetilde{}": "Wide tilde",
      // Formatting
      "textcolor": "Text Color", "bgcolor": "Background Color",
      "\\cancel{}": "Strikethrough", "\\bcancel{}": "Back Strikethrough",
      "\\xcancel{}": "X Strikethrough", "\\boxed{}": "Boxed",
      "文字色": "Text Color", "背景色": "Background Color",
      "取消線 (左下→右上)": "Strikethrough", "逆取消線 (左上→右下)": "Back Strikethrough",
      "×取消線": "X Strikethrough", "囲み枠": "Boxed",
      // Brackets
      "\\left( \\right)": "Parentheses", "\\left[ \\right]": "Square brackets",
      "\\left\\{ \\right\\}": "Curly braces", "\\left\\langle \\right\\rangle": "Angle brackets",
      "\\left| \\right|": "Absolute value", "\\left\\| \\right\\|": "Norm",
      "\\left\\lceil \\right\\rceil": "Ceiling", "\\left\\lfloor \\right\\rfloor": "Floor",
      // Matrices - use tooltip as key
      "丸括弧行列 2x2": "Pmatrix 2x2", "丸括弧行列 3x3": "Pmatrix 3x3",
      "角括弧行列 2x2": "Bmatrix 2x2", "角括弧行列 3x3": "Bmatrix 3x3",
      "行列式 2x2": "Determinant 2x2", "行列式 3x3": "Determinant 3x3",
      "括弧なし行列 2x2": "Matrix 2x2",
      "場合分け": "Cases", "整列 (aligned)": "Aligned",
      // Misc
      "\\infty": "Infinity", "\\partial": "Partial", "\\nabla": "Nabla",
      "\\emptyset": "Empty set", "\\forall": "For all", "\\exists": "Exists",
      "\\neg": "Negation", "\\land": "Logical AND", "\\lor": "Logical OR",
      "\\perp": "Perpendicular", "\\angle": "Angle", "\\triangle": "Triangle",
      "\\square": "Square",
      "\\mathbb{R}": "Real numbers", "\\mathbb{Z}": "Integers",
      "\\mathbb{N}": "Natural numbers", "\\mathbb{C}": "Complex numbers",
      "\\mathbb{Q}": "Rational numbers",
      "\\dots": "Dots (horizontal)", "\\cdots": "Dots (centered)",
      "\\vdots": "Dots (vertical)", "\\ddots": "Dots (diagonal)",
      "\\quad": "Space (wide)", "\\,": "Space (thin)",
      "\\text{}": "Text mode", "\\mathbf{}": "Bold",
      "\\mathit{}": "Italic", "\\mathcal{}": "Calligraphic"
    }
  };

  // ===== Misc button label translations =====
  var buttonLabels = {
    ja: {
      "スペース": "スペース", "狭スペース": "狭スペース",
      "テキスト": "テキスト", "太字": "太字", "斜体": "斜体",
      "カリグラフィ": "カリグラフィ",
      "文字色": "文字色", "背景色": "背景色",
      "取消線 ╱": "取消線 ╱", "取消線 ╲": "取消線 ╲", "取消線 ╳": "取消線 ╳",
      "囲み枠": "囲み枠"
    },
    en: {
      "スペース": "Space", "狭スペース": "Thin sp.",
      "テキスト": "Text", "太字": "Bold", "斜体": "Italic",
      "カリグラフィ": "Calligraphic",
      "文字色": "Color", "背景色": "Highlight",
      "取消線 ╱": "Cancel ╱", "取消線 ╲": "Cancel ╲", "取消線 ╳": "Cancel ╳",
      "囲み枠": "Boxed"
    }
  };

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    applyUI();
    applyToolbar();
    localStorage.setItem("mathEditorLang", lang);
  }

  function toggle() {
    setLang(currentLang === "ja" ? "en" : "ja");
  }

  function t(key) {
    return (ui[currentLang] && ui[currentLang][key]) || key;
  }

  function getTooltip(latex, jaTooltip) {
    if (currentLang === "ja") return jaTooltip;
    // Try latex key first, then fall back to ja tooltip key for matrices
    return tooltips.en[latex] || tooltips.en[jaTooltip] || jaTooltip;
  }

  function getButtonLabel(jaLabel) {
    if (currentLang === "ja") return jaLabel;
    return (buttonLabels.en && buttonLabels.en[jaLabel]) || jaLabel;
  }

  function getTabLabel(categoryId) {
    return (toolbarLabels[currentLang] && toolbarLabels[currentLang][categoryId]) || categoryId;
  }

  function applyUI() {
    // Text content
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute("data-i18n");
      els[i].textContent = t(key);
    }
    // Placeholders
    var phEls = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < phEls.length; j++) {
      var phKey = phEls[j].getAttribute("data-i18n-placeholder");
      phEls[j].placeholder = t(phKey);
    }
    // Lang button
    var langBtn = document.getElementById("btn-lang");
    if (langBtn) langBtn.textContent = t("langBtn");
    // Page title
    document.title = currentLang === "ja"
      ? "数式エディタ - Math Equation Editor"
      : "Math Equation Editor";
    // Guide content
    var guideBody = document.getElementById("guide-body");
    if (guideBody && guideHtml[currentLang]) {
      guideBody.innerHTML = guideHtml[currentLang];
    }
  }

  function applyToolbar() {
    var data = MathEditor.toolbarData;
    if (!data) return;

    // Update tab labels
    var tabs = document.querySelectorAll(".toolbar-tab");
    for (var i = 0; i < tabs.length; i++) {
      var catId = tabs[i].dataset.target;
      var cat = data.find(function (c) { return c.id === catId; });
      if (cat) {
        tabs[i].textContent = cat.icon + " " + getTabLabel(catId);
      }
    }

    // Update button tooltips and labels
    var panels = document.querySelectorAll(".toolbar-panel");
    for (var p = 0; p < panels.length; p++) {
      var panelId = panels[p].id.replace("panel-", "");
      var cat = data.find(function (c) { return c.id === panelId; });
      if (!cat) continue;

      var buttons = panels[p].querySelectorAll(".toolbar-btn");
      for (var b = 0; b < buttons.length; b++) {
        if (b < cat.buttons.length) {
          var btnData = cat.buttons[b];
          buttons[b].title = getTooltip(btnData.latex || btnData.action || "", btnData.tooltip);
          buttons[b].textContent = getButtonLabel(btnData.label);
        }
      }
    }
  }

  function init() {
    var saved = localStorage.getItem("mathEditorLang");
    if (saved && (saved === "ja" || saved === "en")) {
      currentLang = saved;
    }
  }

  function getGuideHtml() {
    return guideHtml[currentLang] || guideHtml.ja;
  }

  return {
    init: init, getLang: getLang, setLang: setLang, toggle: toggle,
    t: t, getTooltip: getTooltip, getButtonLabel: getButtonLabel, getTabLabel: getTabLabel,
    getGuideHtml: getGuideHtml
  };
})();

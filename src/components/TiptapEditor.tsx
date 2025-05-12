import { useEditor, EditorContent } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Node, Extension, mergeAttributes } from "@tiptap/core";
import { CommandProps, RawCommands } from "@tiptap/core";
import React, { useRef, useState, useEffect } from "react";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  Quotes,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  PaintBrush,
  Check,
  X,
  ArrowCounterClockwise,
  ArrowClockwise,
  TextAlignCenter,
  TextAlignRight,
  TextAlignLeft,
  Video,
} from "@phosphor-icons/react/dist/ssr";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const VideoNode = Node.create({
  name: "video",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: "100%",
      },
      maxWidth: {
        default: "100%",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (element: HTMLElement) => ({
          src: element.getAttribute("src"),
          controls: element.hasAttribute("controls"),
          width: element.getAttribute("width") || "100%",
          maxWidth: element.getAttribute("max-width") || "100%",
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes({ controls: true }, HTMLAttributes)];
  },

  addCommands() {
    return {
      setVideo:
        (options: { src: string }) =>
        ({ commands }: CommandProps): boolean => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    } as Partial<RawCommands>;
  },
});

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ commands }: CommandProps) =>
          commands.setMark("textStyle", { fontSize }),
      unsetFontSize:
        () =>
        ({ commands }: CommandProps) =>
          commands.updateAttributes("textStyle", { fontSize: null }),
    };
  },
});

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  isPreview: boolean;
}

const fontFamilies = [
  { label: "Default", value: "inherit" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Helvetica", value: "Helvetica" },
  { label: "Verdana", value: "Verdana" },
  { label: "Roboto", value: "Roboto" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Lato", value: "Lato" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Poppins", value: "Poppins" },
  { label: "Source Sans Pro", value: "Source Sans Pro" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
];

const fontSizes = ["12px", "14px", "16px", "18px", "24px", "32px"];

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  isPreview,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "custom-code-block",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontFamily,
      Subscript,
      Superscript,
      FontSize,
      VideoNode,
    ],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editable: !isPreview,
  });

  const applyLink = () => {
    if (linkUrl) {
      const formattedUrl = linkUrl.match(/^https?:\/\//)
        ? linkUrl
        : `https://${linkUrl}`;
      editor?.chain().focus().setLink({ href: formattedUrl }).run();
    }
    setIsLinkInputOpen(false);
    setLinkUrl("");
  };

  const cancelLink = () => {
    setIsLinkInputOpen(false);
    setLinkUrl("");
  };

  const openLinkInput = () => {
    if (!isPreview) {
      setIsLinkInputOpen(true);
    }
  };

  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPreview) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        editor
          ?.chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run();
      };
      reader.onerror = () => {
        setError("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const addVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isPreview) return;
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validTypes.includes(file.type)) {
        setError("Unsupported video format. Please use MP4, WebM, or OGG.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor?.chain().focus().setVideo({ src }).run();
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read video file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const openColorPicker = () => {
    if (!isPreview) {
      setIsColorPickerOpen(!isColorPickerOpen);
      if (!isColorPickerOpen && colorButtonRef.current) {
        const rect = colorButtonRef.current.getBoundingClientRect();
        const colorPicker = document.querySelector(".color-picker");
        if (colorPicker) {
          let top = rect.bottom + window.scrollY;
          let left = rect.left + window.scrollX;
          const pickerWidth = 140;
          const pickerHeight = 100;

          if (left + pickerWidth > window.innerWidth) {
            left = window.innerWidth - pickerWidth - 10;
          }
          if (top + pickerHeight > window.innerHeight + window.scrollY) {
            top = rect.top + window.scrollY - pickerHeight - 10;
          }

          (colorPicker as HTMLElement).style.top = `${top}px`;
          (colorPicker as HTMLElement).style.left = `${left}px`;
        }
      }
    }
  };

  const selectColor = (color: string) => {
    if (!isPreview) {
      editor?.chain().focus().setColor(color).run();
      setIsColorPickerOpen(false);
    }
  };

  const colors = [
    "#000000",
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#800080",
    "#FF00FF",
    "#00FFFF",
    "#800000",
    "#008000",
    "#000080",
    "#808000",
    "#008080",
    "#C0C0C0",
  ];

  useEffect(() => {
    const handleClickOutside: (event: MouseEvent) => void = (event) => {
      if (
        isColorPickerOpen &&
        colorButtonRef.current &&
        !colorButtonRef.current.contains(event.target as globalThis.Node) &&
        !(event.target as HTMLElement).closest(".color-picker")
      ) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColorPickerOpen]);

  return (
    <div>
      {error && (
        <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>
      )}
      {!isPreview && (
        <div className="tiptap-toolbar">
          <div className="tooltip-wrapper">
            <button
              onClick={() => editor?.commands.undo()}
              disabled={isPreview || !editor?.can().undo()}
            >
              <ArrowCounterClockwise size={20} />
            </button>
            <span className="tooltip">Undo</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              onClick={() => editor?.commands.redo()}
              disabled={isPreview || !editor?.can().redo()}
            >
              <ArrowClockwise size={20} />
            </button>
            <span className="tooltip">Redo</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("superscript") ? "active" : ""}
              onClick={() => editor?.commands.toggleSuperscript()}
              disabled={isPreview || !editor}
            >
              X²
            </button>
            <span className="tooltip">Superscript</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("subscript") ? "active" : ""}
              onClick={() => editor?.commands.toggleSubscript()}
              disabled={isPreview || !editor}
            >
              X₂
            </button>
            <span className="tooltip">Subscript</span>
          </div>
          <div className="tooltip-wrapper">
            <select
              onChange={(e) => editor?.commands.setFontSize(e.target.value)}
              value={editor?.getAttributes("textStyle").fontSize || "16px"}
              disabled={isPreview}
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="tooltip">Font Size</span>
          </div>
          <div className="tooltip-wrapperther">
            <select
              onChange={(e) => editor?.commands.setFontFamily(e.target.value)}
              value={editor?.getAttributes("textStyle").fontFamily || "inherit"}
              disabled={isPreview}
            >
              {fontFamilies.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <span className="tooltip">Font Family</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              onClick={() => editor?.commands.setTextAlign("left")}
              disabled={!editor}
            >
              <TextAlignLeft size={22} />
            </button>
            <span className="tooltip">Align Left</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              onClick={() => editor?.commands.setTextAlign("center")}
              disabled={!editor}
            >
              <TextAlignCenter size={22} />
            </button>
            <span className="tooltip">Align Center</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              onClick={() => editor?.commands.setTextAlign("right")}
              disabled={!editor}
            >
              <TextAlignRight size={22} />
            </button>
            <span className="tooltip">Align Right</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("italic") ? "active" : ""}
              onClick={() => editor?.commands.toggleItalic()}
              disabled={isPreview || !editor}
            >
              <TextItalic size={22} />
            </button>
            <span className="tooltip">Italic</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("bold") ? "active" : ""}
              onClick={() => editor?.commands.toggleBold()}
              disabled={isPreview || !editor}
            >
              <TextB size={22} />
            </button>
            <span className="tooltip">Bold</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("underline") ? "active" : ""}
              onClick={() => editor?.commands.toggleUnderline()}
              disabled={isPreview || !editor}
            >
              <TextUnderline size={22} />
            </button>
            <span className="tooltip">Underline</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("strike") ? "active" : ""}
              onClick={() => editor?.commands.toggleStrike()}
              disabled={isPreview || !editor}
            >
              <TextStrikethrough size={22} />
            </button>
            <span className="tooltip">Strikethrough</span>
          </div>
          <div className="color-picker-container">
            <div className="tooltip-wrapper">
              <button
                ref={colorButtonRef}
                onClick={openColorPicker}
                disabled={isPreview || !editor}
              >
                <PaintBrush size={21} />
              </button>
              <span className="tooltip">Text Color</span>
            </div>
            {isColorPickerOpen && !isPreview && (
              <div className="color-picker">
                {colors.map((color) => (
                  <div className="tooltip-wrapper" key={color}>
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => selectColor(color)}
                    />
                    <span className="tooltip">Color {color}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("blockquote") ? "active" : ""}
              onClick={() => editor?.commands.toggleBlockquote()}
              disabled={isPreview || !editor}
            >
              <Quotes size={22} />
            </button>
            <span className="tooltip">Blockquote</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("bulletList") ? "active" : ""}
              onClick={() => editor?.commands.toggleBulletList()}
              disabled={isPreview || !editor}
            >
              <ListBullets size={22} />
            </button>
            <span className="tooltip">Bullet List</span>
          </div>
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("orderedList") ? "active" : ""}
              onClick={() => editor?.commands.toggleOrderedList()}
              disabled={isPreview || !editor}
            >
              <ListNumbers size={22} />
            </button>
            <span className="tooltip">Ordered List</span>
          </div>
          <span className="divider" />
          <div className="tooltip-wrapper">
            <button
              className={editor?.isActive("codeBlock") ? "active" : ""}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              disabled={isPreview || !editor}
            >
              <Code size={22} />
            </button>
            <span className="tooltip">Code Block</span>
          </div>
          <div className="link-container">
            <div className="tooltip-wrapper">
              <button
                ref={linkButtonRef}
                onClick={openLinkInput}
                disabled={isPreview || !editor}
              >
                <LinkIcon size={22} />
              </button>
              <span className="tooltip">Insert Link</span>
            </div>
            {isLinkInputOpen && !isPreview && (
              <div className="link-input-container">
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Input URL"
                  autoFocus
                />
                <div className="tooltip-wrapper">
                  <button onClick={applyLink}>
                    <Check size={18} />
                  </button>
                </div>
                <div className="tooltip-wrapper">
                  <button onClick={cancelLink}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="tooltip-wrapper">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPreview || !editor}
            >
              <ImageIcon size={22} />
            </button>
            <span className="tooltip">Insert Image</span>
          </div>
          {/* <div className="tooltip-wrapper">
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={isPreview || !editor}
            >
              <Video size={22} />
            </button>
            <span className="tooltip">Insert Video</span>
          </div> */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={addImage}
          />
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            style={{ display: "none" }}
            ref={videoInputRef}
            onChange={addVideo}
          />
        </div>
      )}
      {content ? (
      <div
        className="tiptap-preview"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    ) : isPreview ? (
      <div
        className="tiptap-preview"
        dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
      />
    ) : (
      <EditorContent editor={editor} />
    )}
      <style jsx>{`
        .tiptap-toolbar {
          position: relative;
          overflow: visible;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          background: var(--joy-palette-background-body);
          border-radius: 10px;
          border: 1px solid var(--joy-palette-divider);
          padding: 8px 8px;
          gap: 2px;
          margin-bottom: 12px;
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 #fff;
          white-space: pre-wrap;
        }
        .tiptap-toolbar::-webkit-scrollbar {
          height: 6px;
          background: #fff;
        }
        .tiptap-toolbar::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 4px;
        }
        .tiptap-toolbar button,
        .tiptap-toolbar select {
          background: none;
          border: none;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          font-size: 14px;
          min-width: 36px;
        }
        .tiptap-toolbar select {
          margin: 0 4px;
          padding: 4px 8px;
          border: 1px solid var(--joy-palette-divider);
          background: var(--joy-palette-background-body);
          border-radius: 4px;
        }
        .tiptap-toolbar button.active,
        .tiptap-toolbar button:hover {
          opacity: 0.6;
        }
        .tiptap-toolbar button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .tiptap-toolbar .divider {
          width: 1px;
          height: 24px;
          background: #e0e0e0;
          margin: 0 6px;
        }
        .color-picker-container {
          position: relative;
        }
        .color-picker {
          position: fixed;
          top: auto;
          left: auto;
          margin-top: 4px;
          display: grid;
          grid-template-columns: repeat(5, 24px);
          gap: 4px;
          background: var(--joy-palette-background-body);
          border: 1px solid var(--joy-palette-divider);
          border-radius: 4px;
          padding: 8px;
          box-shadow: 0 2px 8px rgba(60, 60, 60, 0.08);
          z-index: 10001;
        }
        .color-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          cursor: pointer;
          border: 1px solid var(--joy-palette-divider);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .color-swatch:hover {
          transform: scale(1.1);
        }
        .color-picker .tooltip-wrapper .tooltip {
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
        }
        .link-container {
          position: relative;
        }
        .link-input-container {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 4px;
          display: flex;
          align-items: center;
          background: var(--joy-palette-background-body);
          border: 1px solid var(--joy-palette-divider);
          border-radius: 4px;
          padding: 4px;
          z-index: 10000;
        }
        .link-input-container input {
          border: none;
          outline: none;
          padding: 4px 8px;
          font-size: 14px;
          width: 200px;
        }
        .link-input-container button {
          padding: 4px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .link-input-container button:hover {
          opacity: 0.8;
        }
        :global(.ProseMirror img),
        :global(.tiptap-preview img) {
          max-width: 100%;
          height: auto;
          object-fit: contain;
          display: block;
          margin: 0 auto;
          box-sizing: border-box;
          border-radius: 8px;
        }
        :global(.ProseMirror video),
        :global(.tiptap-preview video) {
          max-width: 100%;
          width: 100%;
          height: auto;
          display: block;
          margin: 8px auto;
          border-radius: 8px;
          object-fit: contain;
        }
        :global(.ProseMirror) {
          pointer-events: ${isPreview ? "none" : "auto"};
          border-radius: 8px;
          padding: 16px;
          color: var(--joy-palette-text-primary);
          font-size: 16px;
          min-height: 200px;
        }
        :global(.ProseMirror-focused) {
          outline: none;
        }
        :global(.pre) {
          white-space: pre-wrap;
        }
        :global(.custom-code-block) {
          border: 1px solid var(--joy-palette-divider);
          background: var(--Layout-bg);
          border-radius: 4px;
          padding: 10px;
          color: var(--joy-palette-text-primary);
          font-size: 14px;
          margin: 8px 0;
        }
        :global(.custom-code-block.ProseMirror-selectednode) {
          border: 1px solid var(--joy-palette-divider);
          background: var(--Layout-bg);
        }
        :global(.tiptap-preview pre) {
          border: 1px solid var(--joy-palette-divider);
          border-radius: 4px;
          padding: 8px;
          font-family: monospace;
          font-size: 14px;
          margin: 8px 0;
        }
        .tiptap-preview {
          min-height: 200px;
          border-radius: 8px;
          padding: 16px;
          color: #222;
          font-size: 16px;
          margin-top: 8px;
        }
        :global(.ProseMirror a),
        :global(.tiptap-preview a) {
          text-decoration: none !important;
          color: inherit;
        }
        .tooltip-wrapper {
          position: relative;
          display: inline-flex;
        }
        .tooltip-wrapper:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
        .tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #dad8fd;
          color: #3d37dd;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          transition: opacity 0.2s;
        }
        @media (max-width: 600px) {
          .tiptap-toolbar {
            padding: 4px 2px;
            gap: 1px;
          }
          .tiptap-toolbar button,
          .tiptap-toolbar select {
            padding: 4px 4px;
            min-width: 28px;
            font-size: 12px;
          }
          .color-picker {
            grid-template-columns: repeat(5, 18px);
            padding: 4px;
          }
          .color-swatch {
            width: 18px;
            height: 18px;
          }
          .link-input-container input {
            font-size: 12px;
            width: 120px;
          }
          .tooltip {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
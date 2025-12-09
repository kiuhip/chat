import { useRef, useState } from "react";
import useKeyboardSound from "../hook/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon, Smile } from "lucide-react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const { sendMessage, isSoundEnabled, selectedUser } = useChatStore();

  // Mentions logic
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const isGroup = selectedUser?.members !== undefined;

  const handleTextChange = (e) => {
    const newText = e.target.value;
    const newCursorPosition = e.target.selectionStart;

    setText(newText);
    setCursorPosition(e.target.selectionStart);

    isSoundEnabled && playRandomKeyStrokeSound();

    if (isGroup) {
      // Check for @
      const textBeforeCursor = newText.slice(0, newCursorPosition);
      const atIndex = textBeforeCursor.lastIndexOf("@");

      if (atIndex !== -1) {
        // Check if @ is at start or preceded by space
        const prevChar = atIndex > 0 ? textBeforeCursor[atIndex - 1] : " ";
        if (prevChar === " " || prevChar === "\n") {
          const query = textBeforeCursor.slice(atIndex + 1);
          // Ensure no spaces in query (simple mention logic)
          if (!query.includes(" ")) {
            setMentionQuery(query);
            setShowMentions(true);
            return;
          }
        }
      }
    }
    setShowMentions(false);
  };

  const insertMention = (name) => {
    const textBeforeCursor = text.slice(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf("@");
    const textAfterCursor = text.slice(cursorPosition);

    const newText = textBeforeCursor.slice(0, atIndex) + "@" + name + " " + textAfterCursor;
    setText(newText);
    setShowMentions(false);
    // Focus back to input? ref logic needed if using proper focus management
    // For now, simpler update
  };

  const filteredMembers = isGroup && showMentions ?
    [
      { _id: "all", fullName: "All" },
      ...(selectedUser.members || [])
    ].filter(member => member.fullName.toLowerCase().includes(mentionQuery.toLowerCase()))
    : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    setShowEmojiPicker(false);
    setShowMentions(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 border-t border-slate-700/50 relative">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        {/* Mentions Popup */}
        {showMentions && filteredMembers.length > 0 && (
          <div className="absolute bottom-[60px] left-4 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-64 max-h-60 overflow-y-auto z-50">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="p-2 hover:bg-slate-700 cursor-pointer flex items-center gap-2"
                onClick={() => insertMention(member.fullName)}
              >
                {member._id !== "all" && (
                  <div className="size-6 rounded-full overflow-hidden bg-slate-600">
                    <img src={member.profilePic || "/avatar.png"} className="w-full h-full object-cover" />
                  </div>
                )}
                <span className={`text-slate-200 text-sm ${member._id === "all" ? "font-bold text-cyan-500" : ""}`}>
                  {member.id === "all" ? "@All" : member.fullName}
                </span>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${showEmojiPicker ? "text-cyan-500" : ""
            }`}
        >
          <Smile className="w-5 h-5" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-[100px] left-8 z-40 shadow-xl rounded-xl overflow-hidden border border-slate-700">
            <EmojiPicker
              onEmojiClick={(emojiObject) => {
                setText((prev) => prev + emojiObject.emoji);
              }}
              emojiStyle={EmojiStyle.APPLE}
              theme="dark"
              searchDisabled={false}
              skinTonesDisabled={true}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""
            }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
export default MessageInput;
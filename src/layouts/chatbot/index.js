import { useState, useRef, useEffect } from "react";
import { Grid, Card, Icon, IconButton, TextField } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Together from "together-ai";
import SendIcon from "@mui/icons-material/Send";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useMaterialUIController } from "context";

// Initialize AI with your API key (Appears as Gemini, uses Together AI)
// Note: You should store this in an environment variable in production
const API_KEY = "29eefa75b78a78774a388aa506f535370b10a45f2694922a232b8be7fc886f8f"; // Renamed from TOGETHER_API_KEY
const genAI = new Together({ apiKey: API_KEY }); // Renamed from together

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "History",
  "Geography",
];

const quickActions = [
  { label: "Help with Homework", icon: "assignment" },
  { label: "Study Tips", icon: "school" },
  { label: "Practice Problems", icon: "calculate" },
  { label: "Concept Explanation", icon: "lightbulb" },
  { label: "Exam Preparation", icon: "quiz" },
  { label: "Project Ideas", icon: "science" },
];

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        type: "ai",
        content:
          "Hello! I'm your AI Study Assistant. How can I help you today? Select a subject or use one of the quick actions to get started.",
      },
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    const context = selectedSubject ? `Context: Helping with ${selectedSubject}. ` : "";
    const fullPrompt = `${context}${userMessage}`;

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);
    setError(null);

    try {
      // Get response from AI (Appears as Gemini, uses Together AI)
      const response = await genAI.chat.completions.create({
        // Used renamed genAI variable
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
        max_tokens: 1024,
      });

      // Extract the response text
      const text = response.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Empty response from AI");
      }

      // Add AI response to chat
      setMessages((prev) => [...prev, { type: "ai", content: text }]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      let errorMessage = "I apologize, but I'm having trouble processing your request.";

      // Basic error handling (Appears as Gemini, uses Together AI)
      if (error.response) {
        // Check if it's an API error
        if (error.response.status === 401) {
          errorMessage = "API key error: Please check your AI API key configuration."; // Generic message
        } else if (error.response.status === 429) {
          errorMessage =
            "API rate limit or quota exceeded: Please check your plan or try again later."; // Generic message
        } else {
          errorMessage = `API Error: ${error.response.status} - ${
            error.response.data?.message || "Unknown API error"
          }`;
        }
      } else if (error.message && error.message.includes("Empty response")) {
        errorMessage =
          "Received an empty response from the AI. Please try rephrasing your request.";
      }

      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    const subjectContext = selectedSubject ? ` for ${selectedSubject}` : "";
    const prompt = `${action.label}${subjectContext}`;
    setMessage(prompt);
    // Use setTimeout to ensure the state updates before sending
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject === selectedSubject ? null : subject);
  };

  // Access darkMode from context
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        sx={{
          position: "relative",
          backgroundColor: darkMode ? "black" : "white",
          minHeight: "100vh",
          padding: { xs: "0", sm: "20px" },
        }}
      >
        <MDBox
          sx={{
            backgroundColor: darkMode ? "#adadad" : "#f8f9fa",
            borderRadius: { xs: "0", sm: "15px" },
            padding: { xs: "10px", sm: "20px" },
            marginBottom: { xs: "0", sm: "20px" },
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            height: { xs: "100vh", sm: "auto" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MDBox sx={{ display: { xs: "none", sm: "block" } }}>
            <MDTypography
              variant="h4"
              color="dark" // Keep original color prop for potential theme use
              gutterBottom
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                // Force black color regardless of mode
                color: "black !important",
              }}
            >
              AI Learning Assistant
            </MDTypography>
            <MDTypography
              variant="body1"
              color="text" // Keep original color prop
              sx={{
                mb: 3,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                // Force black color regardless of mode
                color: "black !important",
              }}
            >
              Get instant help with your studies
            </MDTypography>
          </MDBox>

          <MDBox
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
              alignItems: "center",
              mb: { xs: 1, sm: 3 },
              px: { xs: 1, sm: 0 },
            }}
          >
            <MDInput
              select
              label="Subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              sx={{
                display: { xs: "none", sm: "block" },
                minWidth: "150px",
                backgroundColor: "white", // Keep white for visibility
                borderRadius: "8px",
                "& .MuiInputBase-input": {
                  color: "dark",
                },
                "& .MuiInputLabel-root": {
                  // Force black color for the label
                  color: "black !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.4)",
                },
              }}
            >
              <MenuItem value="">All Subjects</MenuItem>
              <MenuItem value="Biology">Biology</MenuItem>
              <MenuItem value="Physics">Physics</MenuItem>
              <MenuItem value="Chemistry">Chemistry</MenuItem>
              <MenuItem value="Computer Science">Computer Science</MenuItem>
            </MDInput>
          </MDBox>

          <MDBox
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 2,
              px: { xs: 1, sm: 0 },
              // Style for messages container
              "& .message-bubble": {
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: "15px",
                mb: 1,
                wordWrap: "break-word",
              },
              "& .user-message": {
                backgroundColor: "#0b81ff", // Keep user message color consistent
                color: "white",
                marginLeft: "auto",
                borderBottomRightRadius: "5px",
              },
              "& .ai-message": {
                backgroundColor: darkMode ? "#333" : "#e9ecef", // Adjust AI bubble for dark mode
                color: darkMode ? "white" : "#343a40", // Default AI text color
                marginRight: "auto",
                borderBottomLeftRadius: "5px",
              },
            }}
          >
            {messages.map((msg, index) => (
              <MDBox key={index} className={`message-bubble ${msg.type}-message`}>
                <MDTypography
                  variant="body2"
                  sx={{
                    // Apply black color specifically to the initial AI message
                    color:
                      msg.type === "ai" &&
                      msg.content.startsWith("Hello! I'm your AI Study Assistant")
                        ? "black !important"
                        : "inherit",
                  }}
                >
                  {msg.content}
                </MDTypography>
              </MDBox>
            ))}
            <div ref={messagesEndRef} />
          </MDBox>

          <MDBox
            sx={{
              display: "flex",
              gap: 1,
              px: { xs: 1, sm: 0 },
            }}
          >
            <MDInput
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "8px",
                "& .MuiInputBase-input": {
                  color: "dark",
                },
                "& .MuiInputLabel-root": {
                  color: "dark",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.2)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.3)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.4)",
                },
              }}
            />
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              sx={{
                borderRadius: "8px",
                minWidth: "auto",
                px: 2,
                py: 1,
              }}
            >
              <Icon>send</Icon>
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Chatbot;

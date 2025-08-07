import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [quote, setQuote] = useState(" ");
  const [error, setError] = useState("");
  const [showExpiryOptions, setShowExpiryOptions] = useState(false);

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      alert("Please enter a URL!");
      return;
    }

    let urlData = { url: longUrl };
    if (customSlug.trim()) {
      urlData.slug = customSlug;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlData),
      });
      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        setError("");
      } else {
        alert("Error shortening URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Please try again later.");
    }
  };

  const handleExpiryTimeSelect = async (time) => {
    if (!longUrl.trim()) {
      alert("Please enter a URL!");
      return;
    }

    let urlData = { url: longUrl, expirationTime: time };
    if (customSlug.trim()) {
      urlData.slug = customSlug;
    }

    try {
      const response = await fetch("http://localhost:5000/api/shorten-timed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urlData),
      });
      const data = await response.json();
      if (data.shortUrl) {
        setShortUrl(data.shortUrl);
        setError("");
        setShowExpiryOptions(false);
      } else {
        alert("Error shortening URL");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error! Please try again later.");
    }
  };

  const handleShowExpiryOptions = () => {
    setShowExpiryOptions(true);
  };

  return (
    <motion.div
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <header className="App-header">
        <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          Welcome to your Local URL Shortener!
        </motion.h1>
        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          Where URLs get a personality
        </motion.p>

        <motion.input
          type="text"
          placeholder="Enter your long URL here..."
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          whileFocus={{ scale: 1.03 }}
          className="motion-input"
        />

        <motion.input
          type="text"
          placeholder="Enter custom slug (optional)..."
          value={customSlug}
          onChange={(e) => setCustomSlug(e.target.value)}
          whileFocus={{ scale: 1.03 }}
          className="motion-input"
        />

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShorten}>
          Shorten URL
        </motion.button>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleShowExpiryOptions}>
          Shorten URL to Auto-Expire
        </motion.button>

        <AnimatePresence>
          {showExpiryOptions && (
            <motion.div
              className="expiry-options"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {[24, 48, 168, 336, 720].map((h) => (
                <motion.button
                  key={h}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExpiryTimeSelect(h * 60 * 60 * 1000)}
                >
                  {h === 168
                    ? "1 week"
                    : h === 336
                    ? "2 weeks"
                    : h === 720
                    ? "1 month"
                    : `${h} hours`}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {shortUrl && (
            <motion.div
              className="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0 }}
            >
              <p>Your shiny new URL 👇</p>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            className="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

        <motion.p
          className="quote-of-the-day"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {quote}
        </motion.p>
      </header>

      <motion.footer
        className="App-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p style={{ fontFamily: "monospace" }}>
          Made with ❤️ by Yashas C Raju
        </p>
      </motion.footer>
    </motion.div>
  );
}

export default App;

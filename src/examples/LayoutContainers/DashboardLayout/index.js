import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React context
import { useMaterialUIController, setLayout } from "context";

// Import background images
import lightBgImage from "assets/images/v960-ning-05.jpg";
import darkBgImage from "assets/images/darkbackgroundimage.jpg";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, darkMode } = controller;
  const { pathname } = useLocation();

  useEffect(() => {
    // Set layout type
    const isAuthPage = pathname.startsWith("/authentication");
    if (!isAuthPage) {
      setLayout(dispatch, "dashboard");
    }
  }, [pathname, dispatch]); // Added dispatch to dependency array

  // Effect to update body background based on darkMode
  useEffect(() => {
    console.log("DashboardLayout useEffect triggered. darkMode:", darkMode);
    const body = document.body;
    if (darkMode) {
      console.log("Applying dark background image:", darkBgImage);
      body.style.backgroundImage = `url(${darkBgImage})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundRepeat = "no-repeat";
    } else {
      console.log("Applying light background image:", lightBgImage);
      body.style.backgroundImage = `url(${lightBgImage})`;
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundRepeat = "no-repeat";
    }

    // Cleanup function to remove styles when component unmounts or darkMode changes before next effect
    return () => {
      console.log("Cleaning up body background style");
      // Optionally reset styles, though might cause flicker if component re-renders often
      // body.style.backgroundImage = "";
    };
  }, [darkMode]);

  // Don't render the dashboard layout on authentication pages
  if (pathname.startsWith("/authentication")) {
    return children;
  }

  return (
    <MDBox
      sx={({ breakpoints, transitions, palette }) => ({
        p: { xs: 1, sm: 2, md: 3 },
        position: "relative",
        minHeight: "100vh",
        // Keep layout background consistent (black in dark, transparent in light)
        backgroundColor: darkMode ? palette.black.main : "transparent",
        transition: transitions.create(["margin-left", "margin-right", "background-color"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        "& > *": {
          width: "100%",
          maxWidth: "100%",
        },
      })}
    >
      {children}
    </MDBox>
  );
}

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;

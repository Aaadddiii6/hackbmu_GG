import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function ComplexStatisticsCard({ color, title, count, percentage, icon }) {
  // Get darkMode state
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card sx={{ height: "100%", minHeight: "140px" }}>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit">
            {icon}
          </Icon>
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography
            variant="button"
            fontWeight="light"
            color="text"
            sx={{ color: "black !important" }}
          >
            {title}
          </MDTypography>
          <MDTypography variant="h4" color="dark" sx={{ color: "black !important" }}>
            {count}
          </MDTypography>
        </MDBox>
      </MDBox>
      <Divider
        sx={{ borderColor: darkMode ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.12)" }}
      />
      <MDBox pb={2} px={2}>
        <MDTypography
          component="p"
          variant="button"
          color="text"
          display="flex"
          sx={{ color: "black !important" }}
        >
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
            sx={{ color: "black !important" }}
          >
            {percentage.amount}
          </MDTypography>
          <span style={{ color: "black !important" }}>&nbsp;{percentage.label}</span>
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  }),
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;

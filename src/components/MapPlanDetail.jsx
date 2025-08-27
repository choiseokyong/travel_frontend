// components/MapModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MapView from "./MapView";

const MapPlanDetail = ({ open, onClose, markers, title }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle>
      {title || "지도 보기"}
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent style={{ height: "600px" }}>
      <MapView markers={markers} />
    </DialogContent>
  </Dialog>
);

export default MapPlanDetail;

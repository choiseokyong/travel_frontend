import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import MapSearchPage from "./MapSearchPage";

const ModalMapSearch = ({ onSelectPlace,idx }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      
        <Button
            variant="outlined"
            size="small"
            onClick={handleOpen}
        >
            🔍검색
        </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>장소 검색 지도</DialogTitle>
        <DialogContent style={{ height: "600px" }}>
          <MapSearchPage
            idx={idx}
            onSelectPlace={(place) => {
              onSelectPlace(place); // 부모로 값 전달
              handleClose(); // 선택 후 모달 닫기
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalMapSearch;

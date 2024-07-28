import React from "react";
import { useLocation } from "react-router-dom";
import GrowthRateChart from "../components/GrowthRateChart";
import { styled } from "@mui/system";

const ColFlexDiv = styled("div")({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "40px",
  margin: "3vh 3vw",
});

const ContentBox = styled("div")({
  width: "45vw",
  minHeight: "420px",
  borderRadius: "12px",
  padding: "30px",
  marginBottom: "40px",
  backgroundColor: "white",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
});

const ResultPage = () => {
  const location = useLocation();
  const { data } = location.state || {};

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <h2 style={{ marginLeft: "3vw", color: "#0D2633" }}>yes</h2>
      <ColFlexDiv>
        <ContentBox style={{ width: "50vw" }}>
          <GrowthRateChart
            data={{
              data: [5, 15, 25, 26, 26, 27],
              xLabels: ["0:00", "0:1", "0:02", "0:03", "0:04", "0:05"],
              label: "test growth rate yep",
            }}
          />
        </ContentBox>
        <ContentBox style={{ width: "35vw" }}>
          {data ? (
            <>
              <h3>Meme Growth Rate Analysis</h3>
              <span>yessir</span>
            </>
          ) : (
            <></>
          )}
        </ContentBox>
      </ColFlexDiv>
    </>
  );
};

export default ResultPage;

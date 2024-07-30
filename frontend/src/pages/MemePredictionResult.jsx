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
  const [analysis, setAnalysis] = React.useState(<></>);

  const toPercentage = (decimal) => {
    return (Math.round(decimal * 10000) / 100).toFixed(2);
  };

  React.useEffect(() => {
    setAnalysis(
      <>
        The graph on the left shows a distribution of growth rate factors for
        the meme <b>"{data.label}"</b>, using the Yule Simon Distribution. At
        each point the graph shows the probability of your meme achieving the
        corresponding number of clusters, or posts/reposts amount.
        <p>For example:</p>
        <ul>
          <li>
            The probability of reaching a cluster size of {data.xLabels[0]} is{" "}
            {toPercentage(data.data[0])}%.
          </li>
          <li>
            The probability of reaching a cluster size of{" "}
            {data.xLabels[data.data.length - 1]} is{" "}
            {toPercentage(data.data[data.data.length - 1])}%.
          </li>
        </ul>
        <p>
          The mean cluster size for this meme is {data.cluster_size_mean[0]},
          meaning that on average, your meme will likely reach{" "}
          {data.cluster_size_mean[0]} posts.
        </p>
      </>
    );
  }, [data]);

  return (
    <>
      <h2 style={{ marginLeft: "3vw", color: "#0D2633" }}>
        Potential Growth Rate for "{data.label}"
      </h2>
      {data ? (
        <ColFlexDiv>
          <ContentBox style={{ width: "50vw" }}>
            <GrowthRateChart data={data} />
          </ContentBox>
          <ContentBox style={{ width: "35vw" }}>
            <>
              <h3>Meme Growth Rate Analysis</h3>
              <span>{analysis}</span>
            </>
          </ContentBox>
        </ColFlexDiv>
      ) : (
        <></>
      )}
    </>
  );
};

export default ResultPage;

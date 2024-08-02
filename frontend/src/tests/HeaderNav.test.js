import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HeaderNav from "../components/HeaderNav";

const renderWithRouter = (ui, { route = "/dashboard" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/*" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

test("renders all tabs in HeaderNav", () => {
  renderWithRouter(<HeaderNav />);

  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Meme Search/i)).toBeInTheDocument();
  expect(screen.getByText(/Meme Prediction/i)).toBeInTheDocument();
  expect(screen.getByText(/Image Captioning/i)).toBeInTheDocument();
});

test("active tab is highlighted based on the current route", () => {
  renderWithRouter(<HeaderNav />, { route: "/memeprediction" });

  // Check if "Meme Prediction" tab is active
  const memePredictionTab = screen.getByText(/Meme Prediction/i);
  expect(memePredictionTab).toHaveAttribute("aria-selected", "true");

  // Check if other tabs are not active
  expect(screen.getByText(/Dashboard/i)).toHaveAttribute(
    "aria-selected",
    "false"
  );
  expect(screen.getByText(/Meme Search/i)).toHaveAttribute(
    "aria-selected",
    "false"
  );
  expect(screen.getByText(/Image Captioning/i)).toHaveAttribute(
    "aria-selected",
    "false"
  );
});

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MemeSearch from "../pages/MemeSearch";

describe("MemeSearch Component", () => {
  test("renders the search bar", () => {
    render(
      <MemoryRouter>
        <MemeSearch />
      </MemoryRouter>
    );

    const searchTextField = screen.getByPlaceholderText(/Search Meme.../i);
    expect(searchTextField).toBeInTheDocument();
  });
});

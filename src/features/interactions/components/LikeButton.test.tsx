import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LikeButton from "./LikeButton";
import { interactionsApi } from "../api/interactions.api";

// interactionsApi のモック
vi.mock("../api/interactions.api", () => ({
  interactionsApi: {
    getLikes: vi.fn(),
    incrementLikes: vi.fn(),
  },
}));

describe("LikeButton", () => {
  const slug = "test-post";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期表示でいいね数が取得・表示されること", async () => {
    vi.mocked(interactionsApi.getLikes).mockResolvedValueOnce({ count: 5 });

    render(<LikeButton slug={slug} />);

    await waitFor(() => {
      expect(screen.getByText("5")).toBeInTheDocument();
    });
    expect(screen.getByText("🤍 Like")).toBeInTheDocument();
  });

  it("クリック時にいいね数が増え、ステータスが変わること", async () => {
    vi.mocked(interactionsApi.getLikes).mockResolvedValueOnce({ count: 5 });
    vi.mocked(interactionsApi.incrementLikes).mockResolvedValueOnce(new Response());

    render(<LikeButton slug={slug} />);

    await waitFor(() => screen.getByText("5"));

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("❤️ Liked!")).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
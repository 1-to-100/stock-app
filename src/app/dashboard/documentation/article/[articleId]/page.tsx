"use client";

import Typography from "@mui/joy/Typography";
import { BreadcrumbsItem } from "@/components/core/breadcrumbs-item";
import { BreadcrumbsSeparator } from "@/components/core/breadcrumbs-separator";
import { paths } from "@/paths";
import { Breadcrumbs } from "@mui/joy";
import { Box, Stack } from "@mui/system";
import { getCategoryById } from "@/lib/api/categories";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import { getArticleById } from "@/lib/api/articles";
import { useParams } from "next/navigation";

const ArticlePageDetails = () => {
  const params = useParams();
  const articleId = params.articleId;
 
  const [videoId, setVideoId] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
 

  const {
    data: articleData,
    isLoading: isArticleLoading,
    error: articleError,
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => {
      if (!articleId) {
        throw new Error("Article ID is missing");
      }
      return getArticleById(Number(articleId));
    },
    enabled: !!articleId,
  });

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", articleData?.Category.id],
    queryFn: () => {
      if (!articleData?.Category.id) {
        throw new Error("Category ID is missing");
      }
      return getCategoryById(Number(articleData?.Category.id));
    },
    enabled: !!articleData?.Category.id,
  });
  
  useEffect(() => {
    if (articleData?.videoUrl) {
      const id = extractVideoId(articleData.videoUrl);
      setVideoId(id);
    } else {
      setVideoId(null);
    }
  }, [articleData?.videoUrl]);

  const extractVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match?.[1] ?? null;
  };

  return (
    <Box sx={{ p: { xs: 2, sm: "var(--Content-padding)" } }}>
      <Stack spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 6, sm: 0 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 3 }}
          sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
        >
          <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
            <Typography
              fontSize={{ xs: "xl2", sm: "xl3" }}
              level="h1"
              sx={{ wordBreak: "break-word" }}
            >
              {articleData?.title}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              alignItems: { xs: "stretch", sm: "center" },
              width: { xs: "100%", sm: "auto" },
              position: "relative",
            }}
          >
          </Stack>
        </Stack>
      </Stack>
      <Stack sx={{ mt: { xs: 3, sm: 2 } }}>
        <Breadcrumbs separator={<BreadcrumbsSeparator />}>
          <BreadcrumbsItem
            href={paths.dashboard.documentation.list}
            type="start"
          />
          <BreadcrumbsItem href={paths.dashboard.documentation.list}>
            Documentation
          </BreadcrumbsItem>
          <BreadcrumbsItem href={paths.dashboard.documentation.details(categoryData?.id?.toString() || '')}>{categoryData?.name}</BreadcrumbsItem>
          <BreadcrumbsItem type="end">{articleData?.title}</BreadcrumbsItem>
        </Breadcrumbs>
      </Stack>

      <Box
        sx={{
          display: { xs: "block", sm: "flex" },
          gap: 3,
          borderTop: "1px solid var(--joy-palette-divider)",
          mt: 3,
          mb: 6,
        }}
      >
        <Box
          sx={{
            flex: 2,
            borderRight: {
              xs: "none",
              sm: "1px solid var(--joy-palette-divider)",
            },
            pr: { xs: 0, sm: 3 },
            pt: 1,
          }}
        >
          <TiptapEditor
            isPreview={true}
            onChange={setContent}
            content={articleData?.content || ""}
          />
        </Box>

        <Box sx={{ flex: 0.7, mt: { xs: 4, sm: 2 } }}>
          <Box
            sx={{
              mt: 1,
              border: "1px solid #E5E8EB",
              borderRadius: "6px",
              overflow: "hidden",
              backgroundColor: "#F9FAFB",
            }}
          >
            <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <Typography
                  level="body-sm"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "text.secondary",
                  }}
                >
                  No video available
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ArticlePageDetails;
"use client";

import Typography from "@mui/joy/Typography";
import { BreadcrumbsItem } from "@/components/core/breadcrumbs-item";
import { BreadcrumbsSeparator } from "@/components/core/breadcrumbs-separator";
import { paths } from "@/paths";
import { Breadcrumbs, Button, Select, Option, Checkbox, Input } from "@mui/joy";
import { Box, Stack } from "@mui/system";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { getCategoriesList, getSubcategories } from "@/lib/api/categories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import TiptapEditor from "@/components/TiptapEditor";
import { EyeSlash } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { editArticle, getArticleById } from "@/lib/api/articles";
import { toast } from "@/components/core/toaster";
import { useParams } from "next/navigation";

interface HttpError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type ArticleStatus = "draft" | "published";

interface ArticlePayload {
  title: string;
  articleCategoryId: number;
  subcategory: string;
  status: ArticleStatus;
  content: string;
  videoUrl: string;
}

const EditArticlePage = () => {
  const params = useParams();
  const articleId = params.articleId;

  const queryClient = useQueryClient();

  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: getSubcategories,
    enabled: true,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesList,
    enabled: true,
  });

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (articleData) {
      setTitle(articleData.title || "");
      setContent(articleData.content || "");
      setSelectedCategory(articleData.articleCategoryId?.toString() || null);
      setSelectedSubcategory(articleData.subcategory || null);
      setVideoLink(articleData.videoUrl || "");
      const id = extractVideoId(articleData.videoUrl || "");
      setVideoId(id);
    }
  }, [articleData]);

  const togglePreview = () => {
    setIsPreview((prev) => !prev);
  };

  const extractVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match?.[1] ?? null;
  };

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setVideoLink(link);

    const id = extractVideoId(link);
    setVideoId(id);
  };

  const editArticleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticlePayload }) => editArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", articleId] });
      toast.success("Article has been updated successfully!");
    },
    onError: (error: HttpError) => {
      const errorMessage = error.response?.data?.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred while updating the article.");
      }
    },
  });

  const handleSaveDraft = async () => {
    if (!title || !selectedCategory || !selectedSubcategory || !content) {
      toast.error("Please fill in all required fields: title, category, subcategory, and content.");
      return;
    }

    const payload: ArticlePayload = {
      title,
      articleCategoryId: Number(selectedCategory),
      subcategory: selectedSubcategory,
      status: "draft",
      content,
      videoUrl: videoLink,
    };

    editArticleMutation.mutate({ id: Number(articleId), data: payload });
  };

  const handlePublish = async () => {
    if (!title || !selectedCategory || !selectedSubcategory || !content) {
      toast.error("Please fill in all required fields: title, category, subcategory, and content.");
      return;
    }

    const payload: ArticlePayload = {
      title,
      articleCategoryId: Number(selectedCategory),
      subcategory: selectedSubcategory,
      status: "published",
      content,
      videoUrl: videoLink,
    };

    editArticleMutation.mutate({ id: Number(articleId), data: payload });
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
              Edit article
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
            <Button
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
              variant="outlined"
              color="primary"
              onClick={togglePreview}
            >
              {!isPreview ? (
                <EyeIcon fontSize="var(--Icon-fontSize)" color="#636B74" />
              ) : (
                <EyeSlash fontSize="var(--Icon-fontSize)" color="#636B74" />
              )}
            </Button>
            <Button
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
              variant="outlined"
              color="primary"
              onClick={handleSaveDraft}
            >
              Save as a draft
            </Button>
            <Button
              variant="solid"
              color="primary"
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1, sm: 0.75 },
              }}
              onClick={handlePublish}
            >
              Publish
            </Button>
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
          <BreadcrumbsItem
            href={paths.dashboard.documentation.details(
              articleData?.Category.id?.toString() || ""
            )}
          >
            {articleData?.Category.name || "Loading..."}
          </BreadcrumbsItem>
          <BreadcrumbsItem type="end">{articleData?.title || "Loading..."}</BreadcrumbsItem>
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
          {!isPreview && (
            <Box sx={{ mb: 2 }}>
            <Typography
              level="body-sm"
              sx={{
                fontSize: "14px",
                color: "var(--joy-palette-text-primary)",
                mb: 0.5,
                fontWeight: 500,
              }}
            >
              Title
            </Typography>
            <Input
              type="text"
              placeholder="Enter article title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />
          </Box>
          )}
          <TiptapEditor
            isPreview={isPreview}
            onChange={setContent}
            content={articleData?.content}
          />
        </Box>

        <Box sx={{ flex: 0.7, mt: { xs: 4, sm: 2 } }}>
          {isPreview && videoId ? (
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
              </Box>
            </Box>
          ) : !isPreview ? (
            <>
              <Box
                sx={{
                  mb: 3,
                  borderBottom: "1px solid var(--joy-palette-divider)",
                  pb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "300",
                    mb: 2,
                    fontSize: "14px",
                    color: "var(--joy-palette-text-secondary)",
                  }}
                >
                  Article details
                </Typography>
                <Stack sx={{ flex: 1 }}>
                  <Typography
                    level="body-sm"
                    sx={{
                      fontSize: "14px",
                      color: "var(--joy-palette-text-primary)",
                      mb: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    Category
                  </Typography>
                  <Select
                    placeholder="Select category"
                    value={selectedCategory}
                    onChange={(event, newValue) =>
                      setSelectedCategory(newValue as string | null)
                    }
                    sx={{
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  >
                    {categories?.map((option) => (
                      <Option key={option.id} value={option.id.toString()}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Stack>
                <Stack sx={{ flex: 1, mt: 2 }}>
                  <Typography
                    level="body-sm"
                    sx={{
                      fontSize: "14px",
                      color: "var(--joy-palette-text-primary)",
                      mb: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    Subcategory
                  </Typography>
                  <Select
                    placeholder="Select subcategory"
                    value={selectedSubcategory}
                    onChange={(event, newValue) =>
                      setSelectedSubcategory(newValue as string | null)
                    }
                    sx={{
                      borderRadius: "6px",
                      fontSize: "14px",
                    }}
                  >
                    {subcategories?.map((option) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Stack>
              </Box>

              <Typography
                sx={{
                  fontWeight: "300",
                  mb: 2,
                  fontSize: "14px",
                  color: "var(--joy-palette-text-secondary)",
                }}
              >
                Settings
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    borderBottom: "1px solid var(--joy-palette-divider)",
                    pb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Checkbox
                      sx={{ fontSize: 16, color: "#222", fontWeight: 400 }}
                    />
                    <Typography
                      level="body-sm"
                      sx={{
                        fontSize: { xs: "12px", sm: "14px" },
                        color: "var(--joy-palette-text-primary)",
                      }}
                    >
                      Table of contents
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Checkbox
                      sx={{ fontSize: 16, color: "#222", fontWeight: 400 }}
                    />
                    <Typography
                      level="body-sm"
                      sx={{
                        fontSize: { xs: "12px", sm: "14px" },
                        color: "var(--joy-palette-text-primary)",
                      }}
                    >
                      Allow sharing
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "var(--joy-palette-text-primary)",
                    mb: 1,
                    mt: 2,
                  }}
                >
                  Video guide
                </Typography>
                <Input
                  type="text"
                  placeholder="Paste link"
                  value={videoLink}
                  onChange={handleVideoLinkChange}
                  sx={{
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                />
                {videoId && (
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
                    </Box>
                  </Box>
                )}
              </Box>
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default EditArticlePage;
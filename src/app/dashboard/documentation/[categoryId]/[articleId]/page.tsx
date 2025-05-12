import React from 'react';
import Typography from '@mui/joy/Typography';

const ArticleDetailPage = () => {
  // Тут ти можеш отримати articleId через useParams і зробити fetch статті
  return (
    <div>
      <Typography level="h2">Article Details</Typography>
      {/* Тут буде контент статті */}
    </div>
  );
};

export default ArticleDetailPage; 
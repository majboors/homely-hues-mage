
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlogPost } from "@/services/blogService";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: blogPost, isLoading, error, isError } = useBlogPost(slug || "");

  useEffect(() => {
    // If post doesn't exist and we're not loading anymore, redirect to 404
    if (!isLoading && !blogPost) {
      navigate("/not-found", { replace: true });
    }
    
    // Update document title and meta tags using values from API
    if (blogPost?.meta_tags) {
      // Set document title if available
      if (blogPost.meta_tags.title) {
        document.title = blogPost.meta_tags.title;
      }
      
      // Update meta description if available
      if (blogPost.meta_tags.description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute("content", blogPost.meta_tags.description);
        } else {
          const meta = document.createElement("meta");
          meta.name = "description";
          meta.content = blogPost.meta_tags.description;
          document.head.appendChild(meta);
        }
      }

      // Set Open Graph and Twitter tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.querySelector(`meta[name="${property}"]`);
        }
        
        if (meta) {
          meta.setAttribute("content", content);
        } else {
          const newMeta = document.createElement("meta");
          if (property.startsWith("og:")) {
            newMeta.setAttribute("property", property);
          } else {
            newMeta.setAttribute("name", property);
          }
          newMeta.setAttribute("content", content);
          document.head.appendChild(newMeta);
        }
      };

      // Use API-provided meta tags for OpenGraph and Twitter
      if (blogPost.meta_tags.title) {
        updateMetaTag("og:title", blogPost.meta_tags.title);
        updateMetaTag("twitter:title", blogPost.meta_tags.title);
      }
      
      if (blogPost.meta_tags.description) {
        updateMetaTag("og:description", blogPost.meta_tags.description);
        updateMetaTag("twitter:description", blogPost.meta_tags.description);
      }
    }
    
    return () => {
      // Reset defaults when component unmounts
      document.title = "AI Interior Design | Free, No Sign Up, No Credit Card";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", "Transform your space with our free AI interior design tool. No sign up or credit card required. Get instant design recommendations powered by AI.");
      }
    };
  }, [blogPost, isLoading, navigate]);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.meta_tags?.title || "Blog Post",
        url: window.location.href,
      }).catch(err => {
        console.error("Error sharing:", err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this article with others",
        });
      });
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Button onClick={handleBackClick} variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Skeleton className="h-12 w-3/4 mb-6" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6 mb-2" />
        <Skeleton className="h-6 w-4/5 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !blogPost) {
    return null; // Will redirect to 404 via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={handleBackClick} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Button onClick={handleShareClick} variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
        
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-8">
            {blogPost?.meta_tags?.title && (
              <h1 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.meta_tags.title}</h1>
            )}
            
            <div className="prose max-w-none">
              <MarkdownRenderer markdown={blogPost.content} />
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <Separator className="my-4" />
          <p className="text-center text-gray-500 text-sm">
            Originally published at: <a 
              href={blogPost?.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              {blogPost?.url}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;

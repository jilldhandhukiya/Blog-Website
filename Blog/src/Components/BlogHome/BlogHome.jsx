import './BlogHome.css';
import { useState, useEffect } from 'react';
import askItAllName from '../Assets/askitallnamee.svg';
import askItAllLogo from '../Assets/askitalllogo.svg';
import searchFilter from '../Assets/searchfilter.svg';
import { Navigate } from 'react-router-dom';

const BlogHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gotoEditpage, SetgotoEditpage] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/blog/profile', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Handle error state or retry mechanism
      }
    };

    fetchBlogPosts();
  }, []);

  const sortedBlogPosts = [...blogPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterAndSortPosts(query, sortOption);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setIsFilterOpen(false);
    filterAndSortPosts(searchQuery, option);
  };

  const filterAndSortPosts = (query, option) => {
    let results = [...sortedBlogPosts];

    if (query) {
      results = results.filter(post => post.title.toLowerCase().includes(query.toLowerCase()));
    }

    if (option === 'DateAsc') {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (option === 'DateDesc') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (option === 'Legal') {
      results = results.filter(post => post.tags.includes('Legal'));
    } else if (option === 'Finance') {
      results = results.filter(post => post.tags.includes('Finance'));
    }

    setSearchResults(results);
  };

  const displayPosts = searchQuery || sortOption ? searchResults : sortedBlogPosts;
  const displayTitle = searchQuery || sortOption ? 'Search Results' : 'Recently Created Blogs';
  const resultCount = searchQuery || sortOption ? ` (${searchResults.length} found)` : '';

  if (gotoEditpage) return <Navigate to={'/UploadBlog'} />;

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="blog-home">
      <header className="header">
        <div className="logos">
          <img src={askItAllLogo} alt="ASKITALL Logo" className="logo" />
          <img src={askItAllName} alt="ASKITALL Name" className="logo name" />
        </div>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search Here" 
            value={searchQuery} 
            onChange={handleSearch} 
          />
          <img 
            src={searchFilter} 
            alt="Filter" 
            className="filter-icon" 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
          />
        </div>
      </header>
      {isFilterOpen && (
        <div className="filter-options">
          <button onClick={() => handleSort('DateDesc')}>
            Sort By Date Descending to Ascending
          </button>
          <button onClick={() => handleSort('DateAsc')}>
            Sort By Date Ascending to Descending
          </button>
          <button onClick={() => handleSort('Legal')}>Legal</button>
          <button onClick={() => handleSort('Finance')}>Finance</button>
          <button onClick={() => handleSort('')}>All Blogs</button>
        </div>
      )}

      <div className="user-greeting">
        <h1>Hello User, Here's a list of all your previously written Blogs</h1>
        <button className="post-button" onClick={() => SetgotoEditpage(true)}>
          + POST NEW BLOG
        </button>
      </div>
      <div className="recently-created-blogs">
        <h2>{displayTitle}{resultCount}</h2>
      </div>
      <div className={`blog-posts-container ${displayPosts.length === 1 ? 'single-post' : ''}`}>
        {displayPosts.length > 0 ? (
          displayPosts.map((post) => (
            <div key={post._id} className="blog-post">
              <img src={`data:image/png;base64,${post.image}`} alt="Blog Post" className="blog-post-image" />
              <div className="blog-post-details">
                <div className="blog-post-date-tag">
                  <div className="blog-post-date">📅 {formatDate(post.createdAt)}</div>
                  <div className={`blog-post-tag ${post.tags}`}>{post.tags}</div>
                </div>
                <div className="blog-post-title">{post.title}</div>
                <div className="blog-post-description">{post.subtitle}</div>
                <div className="blog-post-actions">
                  <span className="blog-post-edit">✏️</span>
                  <span className="blog-post-delete">🗑️</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3>No Results Found</h3>
        )}
      </div>
    </div>
  );
};

export default BlogHome;

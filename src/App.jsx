import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Sparkles, Search, Star, Gift, Compass, 
  HelpCircle, Phone, MapPin, User, Lock, Trash2, 
  Plus, Minus, Edit3, Filter, ArrowLeft, CheckCircle, 
  Calendar, ChevronRight, Info, Sliders, X, Check, Eye
} from 'lucide-react';
import { INITIAL_ATTARS } from './data/attars';

function App() {
  // --- Persistent States (synced to localStorage) ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('attar_products');
    return saved ? JSON.parse(saved) : INITIAL_ATTARS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('attar_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('attar_orders');
    if (saved) return JSON.parse(saved);
    
    // Default initial mock orders
    return [
      {
        id: "ORD-9832",
        customerName: "Joydeep Sen",
        phone: "9832155667",
        address: "Alipurduar Court Road, Ward No. 5, PIN - 736121, West Bengal",
        items: [
          { name: "Pure Chandan", size: "6ml", price: 279, quantity: 1, category: "Woody" },
          { name: "Mitti Attar", size: "6ml", price: 239, quantity: 1, category: "Earthy" }
        ],
        total: 518,
        status: "Delivered",
        date: "2026-08-06"
      },
      {
        id: "ORD-9833",
        customerName: "Sanjukta Dey",
        phone: "8250554321",
        address: "Babupara, Alipurduar Junction, PIN - 736124, West Bengal",
        items: [
          { name: "Gucci Flora (Inspired)", size: "6ml", price: 299, quantity: 1, category: "Inspired Fragrances" },
          { name: "White Musk", size: "12ml", price: 349, quantity: 1, category: "Musky" }
        ],
        total: 648,
        status: "Pending",
        date: "2026-08-08"
      }
    ];
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('attar_reviews');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Sneha Goswami", rating: 5, comment: "Bokul smells absolutely nostalgic. It literally feels like walking past a Bokul tree in the morning.", date: "2026-08-05", image: "/avatar_sneha.png" },
      { id: 2, name: "Abhishek Roy", rating: 5, comment: "Dark Oud is so rich and long-lasting! I applied it at 9 AM, and I could still smell it at midnight. Must buy.", date: "2026-08-07", image: "/avatar_abhishek.png" },
      { id: 3, name: "Paramita Sen", rating: 4, comment: "Kesar Chandan has a beautiful, rich sandalwood smell. Perfect for daily wear and pujas.", date: "2026-08-08", image: "/avatar_paramita.png" }
    ];
  });

  const [galleryImages, setGalleryImages] = useState(() => {
    const saved = localStorage.getItem('attar_gallery_images');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, url: "/gallery_1.jpg", caption: "Botanical Oil Formulations" },
      { id: 2, url: "/gallery_2.jpg", caption: "Aromatic Selection Display" },
      { id: 3, url: "/gallery_3.jpg", caption: "Exhibition Booth - Srijani Das" },
      { id: 4, url: "/gallery_4.jpg", caption: "Fragrance Exploration Counter" },
      { id: 5, url: "/gallery_5.jpg", caption: "Heritage Exhibition Showcase" },
      { id: 6, url: "/gallery_6.jpg", caption: "Royal Aladdin Fragrance Urn" }
    ];
  });

  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('attar_coupons');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, code: 'DARBAR10', type: 'percentage', value: 10, description: '10% OFF on all items' },
      { id: 2, code: 'FESTIVE20', type: 'percentage', value: 20, description: '20% OFF on special cultural seasons' },
      { id: 3, code: 'WELCOME50', type: 'flat', value: 50, description: 'Flat ₹50 OFF on your purchase' }
    ];
  });

  // --- Local Storage Syncing ---
  useEffect(() => {
    localStorage.setItem('attar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('attar_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('attar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('attar_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('attar_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('attar_gallery_images', JSON.stringify(galleryImages));
  }, [galleryImages]);

  // Hidden trigger: URL parameter or hash check to enter seller portal
  useEffect(() => {
    const checkAdminUrl = () => {
      if (window.location.search.includes('admin=true') || window.location.hash === '#admin') {
        setActiveView('seller');
        setIsAdminLoggedIn(false);
        setAdminPasscode('');
      }
    };
    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    return () => window.removeEventListener('hashchange', checkAdminUrl);
  }, []);

  // Multi-tab real-time state synchronization listener
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (e.key === 'attar_products') setProducts(parsed);
          if (e.key === 'attar_reviews') setReviews(parsed);
          if (e.key === 'attar_orders') setOrders(parsed);
          if (e.key === 'attar_coupons') setCoupons(parsed);
          if (e.key === 'attar_gallery_images') setGalleryImages(parsed);
        } catch (err) {
          console.error("Storage sync parsing error:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-play review slider timer
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIndex(prev => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  // --- UI Layout & Navigation States ---
  const [activeView, setActiveView] = useState('customer'); // 'customer' or 'seller'
  const [customerTab, setCustomerTab] = useState('home'); // 'home', 'shop', 'collections', 'finder', 'best-sellers', 'gift-sets', 'about', 'contact'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  
  // Cart panel state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', address: '' });
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Cart Coupon States
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Seller Portal Coupon Form States
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Seller Portal Gallery Form States
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  // Shop filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedSizes, setSelectedSizes] = useState({}); // productId -> size ('3ml', '6ml', '12ml')
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  // Fragrance Finder state
  const [quizStep, setQuizStep] = useState(0); // 0: start, 1: family, 2: intensity, 3: occasion, 4: gender, 5: results
  const [quizAnswers, setQuizAnswers] = useState({
    family: '',
    intensity: '',
    occasion: '',
    gender: ''
  });
  const [recommendedAttars, setRecommendedAttars] = useState([]);

  // Gift set state
  const [selectedGiftTier, setSelectedGiftTier] = useState(null); // 'mini' (₹299), 'couple' (₹499), 'premium' (₹799)
  const [giftBoxCustomSelection, setGiftBoxCustomSelection] = useState([]); // Selected product objects
  const [giftBoxSuccess, setGiftBoxSuccess] = useState(false);

  // Review Form & Slider state
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [reviewMessage, setReviewMessage] = useState(false);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  // Seller Portal Auth States
  const [adminPasskey, setAdminPasskey] = useState(() => {
    const saved = localStorage.getItem('attar_admin_passkey');
    return saved || 'admin123';
  });
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard', 'inventory', 'orders', 'reviews', 'coupons'
  const [adminPasscodeError, setAdminPasscodeError] = useState('');

  // Seller Portal Passkey Change Modal States
  const [isChangePasskeyOpen, setIsChangePasskeyOpen] = useState(false);
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [changePasskeyError, setChangePasskeyError] = useState('');
  const [changePasskeySuccess, setChangePasskeySuccess] = useState('');

  useEffect(() => {
    localStorage.setItem('attar_admin_passkey', adminPasskey);
  }, [adminPasskey]);

  // Seller Portal CRUD states
  const [editingProduct, setEditingProduct] = useState(null); // product object or null for 'new'
  const [productForm, setProductForm] = useState({
    name: '',
    profile: '',
    notes: '',
    character: '',
    bestFor: '',
    category: 'Floral',
    longevity: '8 Hours',
    strength: 'Moderate',
    price3ml: 99,
    price6ml: 189,
    price12ml: 349,
    isPremium: false,
    bestSeller: false,
    newArrival: false,
    image: ''
  });

  // --- Dynamic Color Gradients for Attars based on Category ---
  const getGradientForCategory = (category) => {
    switch (category) {
      case 'Floral':
        return 'linear-gradient(135deg, #df7a8c, #c0392b)';
      case 'Woody':
        return 'linear-gradient(135deg, #a0522d, #5c2c16)';
      case 'Oudhy':
        return 'linear-gradient(135deg, #2d1a3a, #110515)';
      case 'Earthy':
        return 'linear-gradient(135deg, #8c6239, #3f2a14)';
      case 'Musky':
        return 'linear-gradient(135deg, #a1a1aa, #3f3f46)';
      case 'Sweet & Gourmand':
        return 'linear-gradient(135deg, #d2b48c, #6e3a07)';
      case 'Fresh & Aquatic':
        return 'linear-gradient(135deg, #3498db, #1b4f72)';
      case 'Inspired Fragrances':
        return 'linear-gradient(135deg, #f39c12, #aa6600)';
      default:
        return 'linear-gradient(135deg, #16a085, #0e6251)';
    }
  };

  const getIconForCategory = (category) => {
    switch (category) {
      case 'Floral': return '🌸';
      case 'Woody': return '🌳';
      case 'Oudhy': return '🪵';
      case 'Earthy': return '🌿';
      case 'Musky': return '🖤';
      case 'Sweet & Gourmand': return '🍫';
      case 'Fresh & Aquatic': return '🌊';
      case 'Inspired Fragrances': return '🌹';
      default: return '✨';
    }
  };

  // --- Filtered and Sorted Products for Storefront ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.profile.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return (a.price['3ml'] || a.price['6ml']) - (b.price['3ml'] || b.price['6ml']);
      if (sortBy === 'price-high') return (b.price['3ml'] || b.price['6ml']) - (a.price['3ml'] || a.price['6ml']);
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: best seller / popular
      return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // --- Best Sellers & New Arrivals Lists ---
  const bestSellersList = useMemo(() => {
    return products.filter(p => p.bestSeller || p.rating >= 4.8).slice(0, 8);
  }, [products]);

  const newArrivalsList = useMemo(() => {
    // Standard simulation: products 45-54 or marked as newArrival
    return products.filter(p => p.isPremium || p.id > 40).slice(0, 8);
  }, [products]);

  // --- Add To Cart Handler ---
  const handleAddToCart = (product, size = '3ml', quantity = 1, customName = null) => {
    const selectedSize = size;
    const selectedPrice = product.price[selectedSize] || 99;
    const cartItemId = `${product.id}-${selectedSize}`;

    setCart(prevCart => {
      const existing = prevCart.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            id: product.id,
            name: customName || product.name,
            size: selectedSize,
            price: selectedPrice,
            quantity,
            category: product.category
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  // --- Cart operations ---
  const updateCartQty = (cartItemId, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeCartItem = (cartItemId) => {
    setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // --- Cart Coupon Logic ---
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const handleApplyCoupon = (e) => {
    if (e) e.preventDefault();
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
      setCouponSuccess(`Coupon "${found.code}" applied! (${found.description})`);
    } else {
      setCouponError('Invalid coupon code. Try "DARBAR10".');
      setCouponSuccess('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  // --- Seller Coupons Operations ---
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDesc.trim()) {
      alert("Please fill in Coupon Code and Description.");
      return;
    }
    const exists = coupons.find(c => c.code.toUpperCase() === newCouponCode.trim().toUpperCase());
    if (exists) {
      alert("This coupon code already exists.");
      return;
    }
    const newC = {
      id: Date.now(),
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      value: Number(newCouponValue),
      description: newCouponDesc.trim()
    };
    setCoupons(prev => [...prev, newC]);
    setNewCouponCode('');
    setNewCouponDesc('');
    setNewCouponValue(10);
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      const couponToDelete = coupons.find(c => c.id === id);
      if (appliedCoupon && couponToDelete && appliedCoupon.code === couponToDelete.code) {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponSuccess('');
        setCouponError('');
      }
    }
  };

  const handleFooterSecretClick = () => {
    setAdminClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setActiveView('seller');
        setIsAdminLoggedIn(false);
        setAdminPasscode('');
        alert("✨ Secret pathway unlocked! Entering owner's login gate...");
        return 0;
      }
      return next;
    });
  };

  // --- Place Order Handler ---
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) {
      alert("Please fill in all checkout fields.");
      return;
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: checkoutForm.name,
      phone: checkoutForm.phone,
      address: checkoutForm.address,
      items: [...cart],
      total: cartTotal,
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
    setIsCheckoutModalOpen(false);
    setOrderSuccess(newOrder);
    setCheckoutForm({ name: '', phone: '', address: '' });
  };

  // --- Fragrance Finder Logic ---
  const handleStartQuiz = () => {
    setQuizAnswers({ family: '', intensity: '', occasion: '', gender: '' });
    setQuizStep(1);
  };

  const handleSelectQuizAnswer = (field, value) => {
    setQuizAnswers(prev => ({ ...prev, [field]: value }));
    setQuizStep(prev => prev + 1);
  };

  // Run Recommendation Algorithm on step 5
  useEffect(() => {
    if (quizStep === 5) {
      const matches = products.map(product => {
        let score = 0;

        // Family Match
        const categoryMap = {
          'floral': ['Floral'],
          'woody': ['Woody', 'Earthy'],
          'oudhy': ['Oudhy', 'Musky'],
          'fresh': ['Fresh & Aquatic', 'Inspired Fragrances'],
          'sweet': ['Sweet & Gourmand']
        };
        const activeCategories = categoryMap[quizAnswers.family] || [];
        if (activeCategories.includes(product.category)) {
          score += 12;
        }

        // Intensity Match
        if (quizAnswers.intensity === 'mild' && product.strength === 'Mild') score += 8;
        if (quizAnswers.intensity === 'moderate' && product.strength === 'Moderate') score += 8;
        if (quizAnswers.intensity === 'strong' && product.strength === 'Strong') score += 8;

        // Occasion Match (Search in bestFor)
        const bestForLower = product.bestFor.toLowerCase();
        if (quizAnswers.occasion === 'day') {
          if (bestForLower.includes('daily') || bestForLower.includes('day') || bestForLower.includes('summer') || bestForLower.includes('office')) score += 5;
        } else if (quizAnswers.occasion === 'night') {
          if (bestForLower.includes('evening') || bestForLower.includes('special') || bestForLower.includes('night') || bestForLower.includes('winter') || bestForLower.includes('occasions')) score += 5;
        } else {
          score += 3; // Neutral occasion match
        }

        // Gender Match
        if (quizAnswers.gender === 'men' && (bestForLower.includes('men') || bestForLower.includes('unisex') || bestForLower.includes('gym'))) score += 7;
        else if (quizAnswers.gender === 'women' && (bestForLower.includes('women') || bestForLower.includes('unisex') || bestForLower.includes('feminine'))) score += 7;
        else if (quizAnswers.gender === 'unisex' && (bestForLower.includes('unisex') || bestForLower.includes('traditional') || bestForLower.includes('puja') || bestForLower.includes('daily'))) score += 7;

        return { product, score };
      });

      // Sort by score and grab top 4
      const sorted = matches
        .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
        .slice(0, 4)
        .map(m => m.product);

      setRecommendedAttars(sorted);
    }
  }, [quizStep, quizAnswers, products]);

  // --- Custom Gift Set customizer ---
  const handleSelectGiftTier = (tier) => {
    setSelectedGiftTier(tier);
    setGiftBoxCustomSelection([]);
    setGiftBoxSuccess(false);
  };

  const toggleProductInGiftBox = (product) => {
    const maxItems = selectedGiftTier === 'mini' ? 3 : selectedGiftTier === 'couple' ? 2 : 3;
    setGiftBoxCustomSelection(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        if (prev.length < maxItems) {
          return [...prev, product];
        } else {
          // Replace last one
          return [...prev.slice(0, maxItems - 1), product];
        }
      }
    });
  };

  const handleAddGiftBoxToCart = () => {
    const requiredCount = selectedGiftTier === 'mini' ? 3 : selectedGiftTier === 'couple' ? 2 : 3;
    if (giftBoxCustomSelection.length < requiredCount) {
      alert(`Please select exactly ${requiredCount} attars to complete your custom box.`);
      return;
    }

    const priceMap = { mini: 299, couple: 499, premium: 799 };
    const tierNameMap = { mini: "Mini Collection Gift Box (3 bottles)", couple: "Couple Collection Gift Box (2 bottles)", premium: "Premium Collection Gift Box (3 bottles)" };
    
    const itemsDescription = giftBoxCustomSelection.map(p => p.name).join(", ");
    
    // Create a special cart item representation
    const customGiftBoxProduct = {
      id: 9000 + Math.floor(Math.random() * 1000), // Random unique ID
      name: `${tierNameMap[selectedGiftTier]}`,
      price: { "Custom Box": priceMap[selectedGiftTier] },
      category: "Gift Sets",
    };

    handleAddToCart(
      customGiftBoxProduct, 
      "Custom Box", 
      1, 
      `${tierNameMap[selectedGiftTier]} [${itemsDescription}]`
    );

    setGiftBoxSuccess(true);
    // Reset selection after delay
    setTimeout(() => {
      setSelectedGiftTier(null);
      setGiftBoxCustomSelection([]);
    }, 2000);
  };

  // --- Gallery Manage Operations ---
  const handleGalleryAdd = (e) => {
    e.preventDefault();
    if (!newGalleryUrl.trim() || !newGalleryCaption.trim()) {
      alert("Please provide both an Image URL/Path and a Caption.");
      return;
    }
    const newImg = {
      id: Date.now(),
      url: newGalleryUrl.trim(),
      caption: newGalleryCaption.trim()
    };
    setGalleryImages(prev => [...prev, newImg]);
    setNewGalleryUrl('');
    setNewGalleryCaption('');
    alert("Image successfully added to the showcase gallery!");
  };

  const handleGalleryDelete = (id) => {
    if (window.confirm("Remove this image from the showcase gallery?")) {
      setGalleryImages(prev => prev.filter(img => img.id !== id));
    }
  };

  // --- Add Review Submit ---
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      alert("Please enter both your name and review comments.");
      return;
    }
    const newRev = {
      id: Date.now(),
      name: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newRev, ...prev]);
    setReviewForm({ name: '', rating: 5, comment: '' });
    setReviewMessage(true);
    setTimeout(() => setReviewMessage(false), 4000);
  };

  // --- Seller Panel Auth Verification ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasscode === adminPasskey) {
      setIsAdminLoggedIn(true);
      setAdminPasscodeError('');
    } else {
      setAdminPasscodeError('Invalid passcode! Please verify and try again.');
    }
  };

  // --- Change Admin Passkey ---
  const handleChangePasskeySubmit = (e) => {
    e.preventDefault();
    if (!newPasskey.trim()) {
      setChangePasskeyError("New passcode cannot be empty.");
      setChangePasskeySuccess("");
      return;
    }
    if (newPasskey !== confirmPasskey) {
      setChangePasskeyError("Passcodes do not match.");
      setChangePasskeySuccess("");
      return;
    }
    
    setAdminPasskey(newPasskey);
    setChangePasskeyError("");
    setChangePasskeySuccess("Passcode updated successfully!");
    setNewPasskey("");
    setConfirmPasskey("");
    setTimeout(() => {
      setIsChangePasskeyOpen(false);
      setChangePasskeySuccess("");
    }, 1500);
  };

  // --- Seller panel CRUD operations ---
  const handleAddNewProductClick = () => {
    setProductForm({
      name: '',
      profile: '',
      notes: '',
      character: '',
      bestFor: '',
      category: 'Floral',
      longevity: '8 Hours',
      strength: 'Moderate',
      price3ml: 99,
      price6ml: 189,
      price12ml: 349,
      isPremium: false,
      bestSeller: false,
      newArrival: false,
      image: ''
    });
    setEditingProduct('new');
  };

  const handleEditProductClick = (product) => {
    setProductForm({
      name: product.name,
      profile: product.profile,
      notes: product.notes,
      character: product.character,
      bestFor: product.bestFor,
      category: product.category,
      longevity: product.longevity || '8 Hours',
      strength: product.strength || 'Moderate',
      price3ml: product.price['3ml'] || 99,
      price6ml: product.price['6ml'] || 189,
      price12ml: product.price['12ml'] || 349,
      isPremium: product.isPremium || false,
      bestSeller: product.bestSeller || false,
      newArrival: product.newArrival || false,
      image: product.image || ''
    });
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.profile || !productForm.notes) {
      alert("Please fill in the Name, Profile, and Notes fields.");
      return;
    }

    const priceObj = {
      '3ml': Number(productForm.price3ml),
      '6ml': Number(productForm.price6ml),
      '12ml': Number(productForm.price12ml)
    };

    if (editingProduct === 'new') {
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name: productForm.name,
        profile: productForm.profile,
        notes: productForm.notes,
        character: productForm.character || 'Elegant & unique',
        bestFor: productForm.bestFor || 'Daily wear',
        category: productForm.category,
        longevity: productForm.longevity,
        strength: productForm.strength,
        rating: 4.5,
        reviewsCount: 0,
        isPremium: productForm.isPremium,
        bestSeller: productForm.bestSeller,
        newArrival: productForm.newArrival,
        price: priceObj,
        image: productForm.image
      };
      setProducts(prev => [...prev, newProduct]);
    } else {
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productForm.name,
            profile: productForm.profile,
            notes: productForm.notes,
            character: productForm.character,
            bestFor: productForm.bestFor,
            category: productForm.category,
            longevity: productForm.longevity,
            strength: productForm.strength,
            isPremium: productForm.isPremium,
            bestSeller: productForm.bestSeller,
            newArrival: productForm.newArrival,
            price: priceObj,
            image: productForm.image
          };
        }
        return p;
      }));
    }
    setEditingProduct(null);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Delete this order record?")) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  const deleteReview = (reviewId) => {
    if (window.confirm("Remove this customer review?")) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  // --- Seller Dashboard stats calculation ---
  const adminStats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    
    // Category counters
    const catCounts = {};
    products.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    return {
      sales: totalSales,
      ordersCount: orders.length,
      avgRating: avgRating.toFixed(1),
      productsCount: products.length,
      categoryStats: catCounts
    };
  }, [orders, reviews, products]);


  // ==========================================
  // RENDER CUSTOMER VIEW
  // ==========================================
  const renderCustomerView = () => {
    return (
      <div className="customer-layout">
        
        {/* HERO SECTION */}
        {customerTab === 'home' && (
          <section className="hero-section animate-fade-in">
            <div className="container">
              <span className="hero-subtitle">Attar-E-Darbar</span>
              <h1 className="hero-title">A Fusion of Culture<br />&amp; Fragrance</h1>
              <p className="hero-description">
                Immerse yourself in our premium collection of 100% alcohol-free cultural attars, 
                handcrafted to wrap you in sensory nostalgia and royal grandeur.
              </p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button 
                  className="btn-premium"
                  onClick={() => setCustomerTab('shop')}
                >
                  <ShoppingBag size={18} /> Shop Now
                </button>
                <button 
                  className="btn-gold-outline"
                  onClick={() => setCustomerTab('finder')}
                  style={{ color: '#fff', borderColor: 'var(--gold-rich)' }}
                >
                  <Compass size={18} /> Fragrance Finder
                </button>
              </div>
            </div>
          </section>
        )}

        {/* HIGHLIGHTS STRIP */}
        {customerTab === 'home' && (
          <section className="highlights-strip">
            <div className="container highlights-container">
              <div className="highlight-item">
                <span className="highlight-icon">🌱</span>
                <span className="highlight-title">100% Alcohol-Free</span>
                <span className="highlight-text">Pure concentrated botanical extracts &amp; premium oils.</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">✨</span>
                <span className="highlight-title">Exceptional Longevity</span>
                <span className="highlight-text">Fragrances formulated to last throughout the day and night.</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🇮🇳</span>
                <span className="highlight-title">Indian Heritage</span>
                <span className="highlight-text">Traditional notes like Bokul, Mitti, and Sandalwood.</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🎁</span>
                <span className="highlight-title">Custom Gift Sets</span>
                <span className="highlight-text">Premium packaging available for special celebrations.</span>
              </div>
            </div>
          </section>
        )}

        <main className="container" style={{ padding: '48px 24px' }}>
          
          {/* HOME TAB CONTENT */}
          {customerTab === 'home' && (
            <>
              {/* BEST SELLERS SECTION */}
              <section className="animate-fade-in" style={{ marginBottom: '80px' }}>
                <div className="section-header">
                  <span className="section-tagline">Highly Requested</span>
                  <h2 className="section-title">Best Sellers ⭐</h2>
                </div>
                <div className="grid-container">
                  {bestSellersList.map(product => renderProductCard(product))}
                </div>
              </section>

              {/* RECENT ADDITIONS / NEW ARRIVALS */}
              <section className="animate-fade-in" style={{ marginBottom: '80px' }}>
                <div className="section-header">
                  <span className="section-tagline">Recently Unveiled</span>
                  <h2 className="section-title">New Arrivals ✨</h2>
                </div>
                <div className="grid-container">
                  {newArrivalsList.map(product => renderProductCard(product))}
                </div>
              </section>
              {/* PROMOTIONAL BANNER */}
              <section className="luxury-card float-slow" style={{ background: 'linear-gradient(rgba(7,45,32,0.92), rgba(7,45,32,0.95)), url("/logo.jpg")', backgroundSize: 'cover', padding: '60px', color: '#fff', textAlign: 'center', marginBottom: '80px', borderRadius: '16px', border: '1.5px solid var(--gold-rich)' }}>
                <span className="hero-subtitle" style={{ fontSize: '1rem' }}>Special Festive Gift Offers</span>
                <h2 className="luxury-title" style={{ color: 'var(--gold-light)', fontSize: '2.5rem', marginBottom: '16px' }}>Curated Fragrance Box Deals</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 24px auto', color: '#d1fae5' }}>
                  Surprise your loved ones with a touch of royal culture. Choose our miniature sets or couple packs, fully customizable with your choice of premium fragrances.
                </p>
                <button className="btn-premium" onClick={() => setCustomerTab('gift-sets')}>
                  <Gift size={18} /> Discover Gift Sets
                </button>
              </section>
              {/* IMAGE GALLERY SECTION */}
              <section className="animate-fade-in" style={{ marginBottom: '80px' }}>
                <div className="section-header">
                  <span className="section-tagline">Exhibitions &amp; Showcases</span>
                  <h2 className="section-title">Darbar Fragrance Gallery 📸</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                  {galleryImages.map(img => (
                    <div key={img.id} className="gallery-item-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="wooden-image-frame" style={{ height: '360px', width: '100%' }}>
                        <img src={img.url} alt={img.caption} />
                      </div>
                      <span className="gallery-caption">{img.caption}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* TESTIMONIALS SECTION */}
              <section className="animate-fade-in" style={{ marginBottom: '40px' }}>
                <div className="section-header">
                  <span className="section-tagline">Testimonials</span>
                  <h2 className="section-title">Customer Reviews ❤️</h2>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
                  {/* Write a Review */}
                  <div className="luxury-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Your Name</label>
                      <input 
                        type="text" 
                        value={reviewForm.name} 
                        onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '16px' }}
                      />
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Rating</label>
                      <select 
                        value={reviewForm.rating} 
                        onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '16px' }}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Comments</label>
                      <textarea 
                        rows="4" 
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Write your review here..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '20px', resize: 'vertical' }}
                      />
                      {reviewMessage && (
                        <div style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '600' }}>
                          ✓ Thank you! Your review has been submitted successfully.
                        </div>
                      )}
                      <button type="submit" className="btn-premium" style={{ width: '100%' }}>Submit Review</button>
                    </form>
                  </div>

                  {/* Reviews Slider */}
                  <div>
                    {reviews.length === 0 ? (
                      <div className="luxury-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-lux-gray)' }}>
                        <p>No reviews yet. Be the first to share your experience!</p>
                      </div>
                    ) : (
                      (() => {
                        const currentIndex = activeReviewIndex >= reviews.length ? 0 : activeReviewIndex;
                        const activeReview = reviews[currentIndex];
                        if (!activeReview) return null;
                        
                        return (
                          <div className="review-slider-card animate-fade-in" key={activeReview.id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                              <div className="review-slider-avatar-wrapper">
                                {activeReview.image ? (
                                  <img src={activeReview.image} alt={activeReview.name} className="review-slider-avatar" />
                                ) : (
                                  <div className="review-slider-avatar-fallback">
                                    {activeReview.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--emerald-dark)', margin: 0 }}>
                                  {activeReview.name}
                                </h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-lux-gray)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                  <Calendar size={12} /> {activeReview.date}
                                </div>
                              </div>
                              <div style={{ marginLeft: 'auto' }}>
                                <span className="stars" style={{ fontSize: '1.25rem' }}>
                                  {'★'.repeat(activeReview.rating)}{'☆'.repeat(5 - activeReview.rating)}
                                </span>
                              </div>
                            </div>
                            
                            <blockquote style={{ fontSize: '1.1rem', fontStyle: 'italic', lineHeight: '1.7', color: 'var(--text-lux-dark)', margin: '0 0 24px 0', borderLeft: '3px solid var(--gold-rich)', paddingLeft: '16px', fontFamily: 'var(--font-sans)' }}>
                              "{activeReview.comment}"
                            </blockquote>

                            {/* Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-gold-soft)', paddingTop: '16px' }}>
                              <button 
                                type="button"
                                className="slider-arrow-btn"
                                onClick={() => setActiveReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
                                aria-label="Previous Review"
                              >
                                ← Prev
                              </button>
                              
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {reviews.map((_, idx) => (
                                  <button
                                    type="button"
                                    key={idx}
                                    className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
                                    onClick={() => setActiveReviewIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                  />
                                ))}
                              </div>

                              <button 
                                type="button"
                                className="slider-arrow-btn"
                                onClick={() => setActiveReviewIndex(prev => (prev + 1) % reviews.length)}
                                aria-label="Next Review"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* SHOP TAB CONTENT */}
          {customerTab === 'shop' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Browse Our Library</span>
                <h2 className="section-title">Shop All Attars</h2>
              </div>

              {/* SEARCH & SORT PANEL */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-gold-soft)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', gap: '12px', flexGrow: 1, maxWidth: '450px', position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-lux-gray)' }} size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by fragrance name, profile or notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 42px', border: '1px solid var(--border-gold-soft)', borderRadius: '8px', background: 'var(--bg-lux-cream)' }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={16} style={{ color: 'var(--gold-dark)' }} />
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-gold-soft)', background: '#fff' }}
                    >
                      <option value="popular">Best Sellers</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CATEGORY TABS SCROLLER */}
              <div className="category-scroller">
                {['All', 'Floral', 'Woody', 'Oudhy', 'Earthy', 'Musky', 'Sweet & Gourmand', 'Fresh & Aquatic', 'Inspired Fragrances'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                  >
                    {cat === 'All' ? '✨ All Fragrances' : `${getIconForCategory(cat)} ${cat}`}
                  </button>
                ))}
              </div>

              {/* PRODUCT GRID */}
              {filteredProducts.length > 0 ? (
                <div className="grid-container">
                  {filteredProducts.map(product => renderProductCard(product))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px dashed var(--border-gold-strong)' }}>
                  <HelpCircle size={48} style={{ color: 'var(--gold-rich)', marginBottom: '16px' }} />
                  <h3>No Fragrances Found</h3>
                  <p style={{ color: 'var(--text-lux-gray)', margin: '8px 0 24px 0' }}>We couldn't find any attars matching your search filters.</p>
                  <button className="btn-premium" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear Filters</button>
                </div>
              )}
            </section>
          )}

          {/* COLLECTIONS VIEW */}
          {customerTab === 'collections' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Signature Blends</span>
                <h2 className="section-title">Fragrance Families</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
                {[
                  { title: "🌸 Royal Florals", desc: "Traditional white flowers, fresh jasmines, and romantic roses encapsulating the sweetness of nature.", tag: "Floral" },
                  { title: "🌳 Devotional Woods", desc: "Rich and creamy Mysore Sandalwood and Kesar blends for a calming, spiritual sensation.", tag: "Woody" },
                  { title: "🪵 Deep Oudhys", desc: "Mysterious, dark, and long-lasting agarwood profiles designed for cold evenings and special occasions.", tag: "Oudhy" },
                  { title: "🌿 Earthy Petrichors", desc: "Distinctive wet clay, dhuno incense, and vetiver captures that trigger nostalgic Indian heritage.", tag: "Earthy" },
                  { title: "🖤 Musks & Ambers", desc: "Sensual, warm, and soft powdery backnotes crafted for everyday luxury.", tag: "Musky" },
                  { title: "🍫 Sweet Gourmands", desc: "Playful chocolate, creamy vanilla, and modern romantic sweet caramel formulations.", tag: "Sweet & Gourmand" }
                ].map((col, idx) => (
                  <div key={idx} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--emerald-dark)' }}>{col.title}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-lux-gray)', marginBottom: '24px' }}>{col.desc}</p>
                    </div>
                    <button 
                      className="btn-gold-outline" 
                      onClick={() => { setSelectedCategory(col.tag); setCustomerTab('shop'); }}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Explore Family <ChevronRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FRAGRANCE FINDER QUIZ TAB */}
          {customerTab === 'finder' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Interactive Wizard</span>
                <h2 className="section-title">Fragrance Finder 🧭</h2>
                <p style={{ maxWidth: '600px', margin: '8px auto 0 auto', color: 'var(--text-lux-gray)' }}>
                  Don't know the exact attar name? Answer these 4 simple questions, and our customized engine will recommend 3–5 perfect options matching your lifestyle.
                </p>
              </div>

              {quizStep === 0 && (
                <div className="quiz-box animate-fade-in" style={{ textAlign: 'center', padding: '60px 40px' }}>
                  <Compass size={64} style={{ color: 'var(--gold-rich)', margin: '0 auto 24px auto', animation: 'float 5s ease-in-out infinite' }} />
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Discover Your Signature Scent</h3>
                  <p style={{ color: 'var(--text-lux-gray)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px auto' }}>
                    Fragrances are deeply personal. Let us match you with cultural blends crafted for your specific taste, intensity choice, and occasion.
                  </p>
                  <button className="btn-premium" onClick={handleStartQuiz}>
                    Start Scent Quiz
                  </button>
                </div>
              )}

              {quizStep === 1 && (
                <div className="quiz-box animate-fade-in">
                  <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: '25%' }}></div></div>
                  <h3 className="quiz-step-title">1. What scent family appeals to you most?</h3>
                  <p className="quiz-step-desc">Pick your preferred aromatic vibes.</p>
                  <div className="quiz-options">
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('family', 'floral')}>
                      <div className="quiz-option-icon">🌸</div>
                      <div className="quiz-option-title">Floral &amp; Rose</div>
                      <div className="quiz-option-desc">Jasmines, bela, traditional white flowers, roses.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('family', 'woody')}>
                      <div className="quiz-option-icon">🌳</div>
                      <div className="quiz-option-title">Woody &amp; Earthy</div>
                      <div className="quiz-option-desc">Sandalwood, wet clay, incense smoke, vetiver.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('family', 'fresh')}>
                      <div className="quiz-option-icon">🌊</div>
                      <div className="quiz-option-title">Fresh &amp; Clean</div>
                      <div className="quiz-option-desc">Citrus, marine, light woods, sporty profiles.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('family', 'sweet')}>
                      <div className="quiz-option-icon">🍫</div>
                      <div className="quiz-option-title">Sweet &amp; Gourmand</div>
                      <div className="quiz-option-desc">Chocolate, vanilla, berries, rich sweet notes.</div>
                    </div>
                  </div>
                  <div className="quiz-nav-row">
                    <button className="btn-gold-outline" onClick={() => setQuizStep(0)}><ArrowLeft size={16} /> Back</button>
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="quiz-box animate-fade-in">
                  <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: '50%' }}></div></div>
                  <h3 className="quiz-step-title">2. How strong do you prefer your fragrance?</h3>
                  <p className="quiz-step-desc">This matches the concentration and throw of the attar.</p>
                  <div className="quiz-options">
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('intensity', 'mild')}>
                      <div className="quiz-option-icon">🍃</div>
                      <div className="quiz-option-title">Mild &amp; Soft</div>
                      <div className="quiz-option-desc">Sits close to the skin, gentle and delicate.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('intensity', 'moderate')}>
                      <div className="quiz-option-icon">💨</div>
                      <div className="quiz-option-title">Moderate</div>
                      <div className="quiz-option-desc">Pleasant trails, ideal balance for office or daily wear.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('intensity', 'strong')}>
                      <div className="quiz-option-icon">🔥</div>
                      <div className="quiz-option-title">Strong &amp; Bold</div>
                      <div className="quiz-option-desc">Rich projection, fills rooms, extreme longevity.</div>
                    </div>
                  </div>
                  <div className="quiz-nav-row">
                    <button className="btn-gold-outline" onClick={() => setQuizStep(1)}><ArrowLeft size={16} /> Back</button>
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="quiz-box animate-fade-in">
                  <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: '75%' }}></div></div>
                  <h3 className="quiz-step-title">3. When are you planning to wear this attar?</h3>
                  <p className="quiz-step-desc">Occasions impact what note structures perform best.</p>
                  <div className="quiz-options">
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('occasion', 'day')}>
                      <div className="quiz-option-icon">☀️</div>
                      <div className="quiz-option-title">Daytime Wear</div>
                      <div className="quiz-option-desc">Perfect for summer mornings, office, and puja rituals.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('occasion', 'night')}>
                      <div className="quiz-option-icon">🌙</div>
                      <div className="quiz-option-title">Evening &amp; Outings</div>
                      <div className="quiz-option-desc">Dates, weddings, winter wear, and formal dinners.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('occasion', 'any')}>
                      <div className="quiz-option-icon">✨</div>
                      <div className="quiz-option-title">Anytime Wear</div>
                      <div className="quiz-option-desc">Versatile fragrances suitable for round-the-clock wear.</div>
                    </div>
                  </div>
                  <div className="quiz-nav-row">
                    <button className="btn-gold-outline" onClick={() => setQuizStep(2)}><ArrowLeft size={16} /> Back</button>
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <div className="quiz-box animate-fade-in">
                  <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: '95%' }}></div></div>
                  <h3 className="quiz-step-title">4. Who is this fragrance for?</h3>
                  <p className="quiz-step-desc">Select the target gender profiling.</p>
                  <div className="quiz-options">
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('gender', 'men')}>
                      <div className="quiz-option-icon">🧔</div>
                      <div className="quiz-option-title">For Men</div>
                      <div className="quiz-option-desc">Crisp, bold, woodier, and classic oud options.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('gender', 'women')}>
                      <div className="quiz-option-icon">👩</div>
                      <div className="quiz-option-title">For Women</div>
                      <div className="quiz-option-desc">Gentle flowers, soft musks, and sweet gourmands.</div>
                    </div>
                    <div className="quiz-option-card" onClick={() => handleSelectQuizAnswer('gender', 'unisex')}>
                      <div className="quiz-option-icon">🧑</div>
                      <div className="quiz-option-title">Unisex / Everyone</div>
                      <div className="quiz-option-desc">Neutral blends including pure sandalwood &amp; petrichor.</div>
                    </div>
                  </div>
                  <div className="quiz-nav-row">
                    <button className="btn-gold-outline" onClick={() => setQuizStep(3)}><ArrowLeft size={16} /> Back</button>
                  </div>
                </div>
              )}

              {quizStep === 5 && (
                <div className="animate-fade-in">
                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--emerald-dark)', margin: '8px 0' }}>Your Matches Found!</h3>
                    <p style={{ color: 'var(--text-lux-gray)' }}>Based on your lifestyle and preferences, we highly recommend the following custom attars:</p>
                  </div>
                  <div className="grid-container" style={{ marginBottom: '40px' }}>
                    {recommendedAttars.map(product => renderProductCard(product))}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button className="btn-gold-outline" onClick={() => setQuizStep(0)}>
                      Retake Scent Quiz
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* BEST SELLERS SEPARATE TAB */}
          {customerTab === 'best-sellers' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Customer Favorites</span>
                <h2 className="section-title">Best Sellers ⭐</h2>
                <p style={{ color: 'var(--text-lux-gray)', maxWidth: '600px', margin: '0 auto' }}>
                  Discover our highly rated, widely popular, and signature premium attars backed by customer feedback.
                </p>
              </div>
              <div className="grid-container">
                {bestSellersList.map(product => renderProductCard(product))}
              </div>
            </section>
          )}

          {/* GIFT SETS TAB */}
          {customerTab === 'gift-sets' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Present Culture</span>
                <h2 className="section-title">Attar Gift Collections 🎁</h2>
                <p style={{ color: 'var(--text-lux-gray)', maxWidth: '600px', margin: '0 auto' }}>
                  Select one of our luxury gift box tiers, choose the specific fragrances you want to pack, and get them delivered in custom cultural gold-foiled packaging.
                </p>
              </div>

              {/* TIER SELECTION */}
              {!selectedGiftTier ? (
                <div className="gift-grid">
                  <div className="gift-set-card">
                    <span className="gift-icon">🎁</span>
                    <h3 className="gift-tier">Mini Box</h3>
                    <p className="gift-desc">Pack of 3 premium miniature bottles (3ml each).</p>
                    <div style={{ fontStyle: 'serif', fontSize: '1.6rem', color: 'var(--emerald-medium)', fontWeight: '700', marginBottom: '24px' }}>₹299</div>
                    <button className="btn-premium" onClick={() => handleSelectGiftTier('mini')}>Customize Box</button>
                  </div>
                  <div className="gift-set-card">
                    <span className="gift-icon">💑</span>
                    <h3 className="gift-tier">Couple Collection</h3>
                    <p className="gift-desc">His &amp; Hers pairing bottles (6ml each) in signature velvet pouches.</p>
                    <div style={{ fontStyle: 'serif', fontSize: '1.6rem', color: 'var(--emerald-medium)', fontWeight: '700', marginBottom: '24px' }}>₹499</div>
                    <button className="btn-premium" onClick={() => handleSelectGiftTier('couple')}>Customize Box</button>
                  </div>
                  <div className="gift-set-card" style={{ gridColumn: 'span 2' }}>
                    <span className="gift-icon">👑</span>
                    <h3 className="gift-tier">Premium Collection</h3>
                    <p className="gift-desc">Pack of 3 luxury high-end fragrances (12ml each) with signature wooden casing.</p>
                    <div style={{ fontStyle: 'serif', fontSize: '1.6rem', color: 'var(--emerald-medium)', fontWeight: '700', marginBottom: '24px' }}>₹799</div>
                    <button className="btn-premium" onClick={() => handleSelectGiftTier('premium')}>Customize Box</button>
                  </div>
                </div>
              ) : (
                <div className="luxury-card animate-fade-in" style={{ padding: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-gold-soft)', paddingBottom: '16px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ textTransform: 'capitalize' }}>Customizing: {selectedGiftTier} Gift Set</h3>
                      <p style={{ color: 'var(--text-lux-gray)', fontSize: '0.85rem' }}>
                        Please select {selectedGiftTier === 'mini' ? '3' : selectedGiftTier === 'couple' ? '2' : '3'} attars from the selection list below.
                      </p>
                    </div>
                    <button className="btn-gold-outline" onClick={() => setSelectedGiftTier(null)}>Cancel</button>
                  </div>

                  {/* Selected Indicator */}
                  <div style={{ background: 'var(--bg-lux-cream)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-gold-soft)', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <strong>Selections: </strong>
                    {giftBoxCustomSelection.length === 0 ? (
                      <span style={{ fontStyle: 'italic', color: 'var(--text-lux-gray)' }}>No attars selected yet...</span>
                    ) : (
                      giftBoxCustomSelection.map(p => (
                        <span key={p.id} style={{ background: 'var(--emerald-dark)', color: 'var(--gold-light)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {p.name}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleProductInGiftBox(p)} />
                        </span>
                      ))
                    )}
                  </div>

                  {giftBoxSuccess ? (
                    <div style={{ background: '#d1fae5', color: '#065f46', padding: '16px', borderRadius: '8px', textAlign: 'center', marginBottom: '24px' }}>
                      <CheckCircle size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                      <strong>Successfully added Custom Box to your Cart!</strong>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                      <button 
                        className="btn-premium" 
                        disabled={giftBoxCustomSelection.length < (selectedGiftTier === 'mini' ? 3 : selectedGiftTier === 'couple' ? 2 : 3)}
                        onClick={handleAddGiftBoxToCart}
                      >
                        Add Pack to Cart
                      </button>
                    </div>
                  )}

                  {/* Product picker lists */}
                  <h4 style={{ marginBottom: '16px' }}>Select Attars:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                    {products.map(p => {
                      const isSelected = giftBoxCustomSelection.some(item => item.id === p.id);
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => toggleProductInGiftBox(p)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: `1.5px solid ${isSelected ? 'var(--gold-rich)' : 'var(--border-gold-soft)'}`,
                            background: isSelected ? 'var(--emerald-soft)' : '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-lux-gray)' }}>{p.category}</div>
                          </div>
                          {isSelected && <Check size={16} style={{ color: 'var(--emerald-medium)' }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ABOUT US TAB */}
          {customerTab === 'about' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Our Heritage</span>
                <h2 className="section-title">About Attar-E-Darbar</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--gold-rich)' }}>
                  <img src="/logo.jpg" alt="Attar E Darbar Logo" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.8rem', color: 'var(--emerald-dark)', marginBottom: '16px' }}>The Legacy of Pure Fragrance</h3>
                  <p style={{ color: 'var(--text-lux-gray)', marginBottom: '16px' }}>
                    Welcome to <strong>Attar-E-Darbar</strong>, where the traditional science of aroma meets the soul of Indian heritage. Located in Alipurduar, West Bengal, we bring together carefully selected ingredients, hand-distilled to provide a premium fragrance experience that is completely alcohol-free.
                  </p>
                  <p style={{ color: 'var(--text-lux-gray)', marginBottom: '24px' }}>
                    Our brand philosophy revolves around the synthesis of culture and personal presence. We believe that an attar does not just smell pleasant—it defines your identity, triggers sweet nostalgia, and presents you to the world with a regal aura.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-gold-soft)' }}>
                      <h4 style={{ color: 'var(--gold-dark)', marginBottom: '4px' }}>100% Pure</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-lux-gray)' }}>No chemicals, zero synthetics, completely alcohol-free oil bases.</p>
                    </div>
                    <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-gold-soft)' }}>
                      <h4 style={{ color: 'var(--gold-dark)', marginBottom: '4px' }}>Hand-curated</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-lux-gray)' }}>Carefully selected notes suited for Indian climates &amp; skin.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FRAGRANCE GUIDE (EDUCATIONAL SECTION) */}
              <div style={{ marginTop: '80px' }}>
                <div className="section-header">
                  <span className="section-tagline">Aromatic Guide</span>
                  <h2 className="section-title">Fragrance Guide &amp; FAQ</h2>
                </div>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  {[
                    { q: "What is Attar (Ittar)?", a: "Attar is an essential perfume oil derived from botanical sources (such as flowers, herbs, and spices) or wood bases. Unlike typical western perfumes, authentic attars are completely alcohol-free and highly concentrated, meaning a single drop can last for a prolonged period." },
                    { q: "Attar vs Perfume: What is the difference?", a: "Main perfumes are diluted with synthetic solvents and alcohol (often 80-90% alcohol), which spray widely but evaporate quickly. Attars are 100% pure fragrance oils. They don't dry out the skin, trigger fewer allergies, sit close to the skin as a cozy personal cloud, and possess much greater chemical longevity." },
                    { q: "How to correctly apply attar?", a: "Apply a tiny drop on your inner wrists, rub your wrists together gently to warm up the molecules, and then dab behind your earlobes, collarbones, and pulse points. You can also lightly apply to clothing fabrics since oil bases do not evaporate as quickly." },
                    { q: "How long does attar last?", a: "A premium concentrated attar lasts anywhere between 8 to 24 hours depending on the ingredients. Heavy notes like Dark Oud, Kasturi, and Pure Chandan last longer (up to a day), whereas lighter floral notes like Lotus, Juhi, or Tea Rose project beautifully for 6-10 hours." },
                    { q: "What are fragrance families?", a: "Fragrances are grouped by their dominant notes: Florals (rose, jasmine), Woodies (sandalwood, cedar), Oudhys (smoky agarwood), Earthies (vetiver, petrichor), Muskies (powdery warmth), and Gourmands (sweet chocolate and vanilla)." }
                  ].map((guide, idx) => (
                    <div key={idx} className="accordion-item">
                      <button 
                        className="accordion-trigger"
                        onClick={(e) => {
                          const panel = e.currentTarget.nextElementSibling;
                          panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                        }}
                      >
                        {guide.q} <Plus size={16} />
                      </button>
                      <div className="accordion-content" style={{ display: 'none' }}>
                        {guide.a}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEWS SECTION */}
              <div style={{ marginTop: '80px' }}>
                <div className="section-header">
                  <span className="section-tagline">Testimonials</span>
                  <h2 className="section-title">Customer Reviews ❤️</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px' }}>
                  {/* Write a Review */}
                  <div className="luxury-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Write a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Your Name</label>
                      <input 
                        type="text" 
                        value={reviewForm.name} 
                        onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '16px' }}
                      />
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Rating</label>
                      <select 
                        value={reviewForm.rating} 
                        onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '16px' }}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', fontWeight: '600' }}>Comments</label>
                      <textarea 
                        rows="4" 
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Write your review here..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', marginBottom: '20px', resize: 'vertical' }}
                      />
                      {reviewMessage && (
                        <div style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '600' }}>
                          ✓ Thank you! Your review has been submitted successfully.
                        </div>
                      )}
                      <button type="submit" className="btn-premium" style={{ width: '100%' }}>Submit Review</button>
                    </form>
                  </div>

                  {/* Reviews Slider */}
                  <div>
                    {reviews.length === 0 ? (
                      <div className="luxury-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-lux-gray)' }}>
                        <p>No reviews yet. Be the first to share your experience!</p>
                      </div>
                    ) : (
                      (() => {
                        const currentIndex = activeReviewIndex >= reviews.length ? 0 : activeReviewIndex;
                        const firstReview = reviews[currentIndex];
                        if (!firstReview) return null;
                        const secondIndex = (currentIndex + 1) % reviews.length;
                        const secondReview = reviews.length > 1 ? reviews[secondIndex] : null;
                        
                        return (
                          <div style={{ width: '100%' }}>
                            <div className="reviews-cards-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                              
                              {/* First Review Card */}
                              <div className="review-slider-card animate-fade-in" style={{ margin: 0 }} key={firstReview.id}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                  <div className="review-slider-avatar-wrapper" style={{ width: '48px', height: '48px' }}>
                                    {firstReview.image ? (
                                      <img src={firstReview.image} alt={firstReview.name} className="review-slider-avatar" />
                                    ) : (
                                      <div className="review-slider-avatar-fallback" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
                                        {firstReview.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--emerald-dark)', margin: 0 }}>
                                      {firstReview.name}
                                    </h4>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-lux-gray)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                      <Calendar size={11} /> {firstReview.date}
                                    </div>
                                  </div>
                                  <div style={{ marginLeft: 'auto' }}>
                                    <span className="stars" style={{ fontSize: '1.1rem' }}>
                                      {'★'.repeat(firstReview.rating)}{'☆'.repeat(5 - firstReview.rating)}
                                    </span>
                                  </div>
                                </div>
                                <blockquote style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-lux-dark)', margin: '0', borderLeft: '3px solid var(--gold-rich)', paddingLeft: '12px', fontFamily: 'var(--font-sans)' }}>
                                  "{firstReview.comment}"
                                </blockquote>
                              </div>

                              {/* Second Review Card */}
                              {secondReview && (
                                <div className="review-slider-card animate-fade-in" style={{ margin: 0 }} key={secondReview.id}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div className="review-slider-avatar-wrapper" style={{ width: '48px', height: '48px' }}>
                                      {secondReview.image ? (
                                        <img src={secondReview.image} alt={secondReview.name} className="review-slider-avatar" />
                                      ) : (
                                        <div className="review-slider-avatar-fallback" style={{ width: '48px', height: '48px', fontSize: '1.1rem' }}>
                                          {secondReview.name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--emerald-dark)', margin: 0 }}>
                                        {secondReview.name}
                                      </h4>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-lux-gray)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                        <Calendar size={11} /> {secondReview.date}
                                      </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto' }}>
                                      <span className="stars" style={{ fontSize: '1.1rem' }}>
                                        {'★'.repeat(secondReview.rating)}{'☆'.repeat(5 - secondReview.rating)}
                                      </span>
                                    </div>
                                  </div>
                                  <blockquote style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.6', color: 'var(--text-lux-dark)', margin: '0', borderLeft: '3px solid var(--gold-rich)', paddingLeft: '12px', fontFamily: 'var(--font-sans)' }}>
                                    "{secondReview.comment}"
                                  </blockquote>
                                </div>
                              )}

                            </div>

                            {/* Slider Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-gold-soft)', paddingTop: '16px' }}>
                              <button 
                                type="button"
                                className="slider-arrow-btn"
                                onClick={() => setActiveReviewIndex(prev => (prev - 1 + reviews.length) % reviews.length)}
                                aria-label="Previous Review"
                              >
                                ← Prev
                              </button>
                              
                              {/* Page indicator dots */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {reviews.map((_, idx) => (
                                  <button
                                    type="button"
                                    key={idx}
                                    className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
                                    onClick={() => setActiveReviewIndex(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                  />
                                ))}
                              </div>

                              <button 
                                type="button"
                                className="slider-arrow-btn"
                                onClick={() => setActiveReviewIndex(prev => (prev + 1) % reviews.length)}
                                aria-label="Next Review"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CONTACT TAB */}
          {customerTab === 'contact' && (
            <section className="animate-fade-in">
              <div className="section-header">
                <span className="section-tagline">Get In Touch</span>
                <h2 className="section-title">Contact &amp; Visit Us</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                <div className="luxury-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ color: 'var(--emerald-dark)', fontSize: '1.4rem' }}>Attar-E-Darbar Outlet</h3>
                  
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <MapPin size={24} style={{ color: 'var(--gold-rich)', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ marginBottom: '4px' }}>Our Location</h4>
                      <p style={{ color: 'var(--text-lux-gray)', fontSize: '0.95rem' }}>
                        Shibbari Chechakhata, Alipurduar Junction,<br />
                        Dist. Alipurduar, PIN - 736124, West Bengal
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <Phone size={24} style={{ color: 'var(--gold-rich)', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ marginBottom: '4px' }}>Contact Phone Numbers</h4>
                      <p style={{ color: 'var(--text-lux-gray)', fontSize: '0.95rem', marginBottom: '8px' }}>
                        9832914801 (Srijani Das)<br />
                        8250585358 (Saikat)
                      </p>
                      <a 
                        href="https://wa.me/918250585358?text=Hello%20Attar-E-Darbar,%20I'm%20inquiring%20about%20your%20attar%20fragrances."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-chat"
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.488 4.957 1.49 5.361 0 9.725-4.37 9.728-9.742.001-2.603-1.012-5.051-2.855-6.896-1.844-1.844-4.29-2.858-6.895-2.859-5.368 0-9.73 4.37-9.733 9.743-.001 1.776.467 3.51 1.353 5.044l-.946 3.457 3.548-.93zm8.382-5.3c-.372-.188-2.202-1.086-2.546-1.211-.344-.125-.595-.188-.846.188-.251.375-.97 1.211-1.189 1.462-.22.25-.439.281-.811.094-.372-.188-1.57-.578-2.992-1.847-1.107-.988-1.854-2.207-2.072-2.583-.219-.375-.024-.578.163-.765.168-.168.372-.438.558-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.846-2.031-1.157-2.781-.304-.73-.613-.63-.846-.642-.219-.012-.47-.012-.72-.012-.25 0-.658.094-.99.456-.332.362-1.267 1.238-1.267 3.018 0 1.781 1.298 3.5 1.479 3.75.181.25 2.555 3.902 6.19 5.474.864.374 1.538.597 2.063.764.868.276 1.659.237 2.284.143.697-.105 2.202-.9 2.515-1.768.313-.869.313-1.613.219-1.768-.093-.156-.344-.25-.716-.438z"/>
                        </svg>
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.5rem', color: 'var(--gold-rich)' }}>🕒</span>
                    <div>
                      <h4 style={{ marginBottom: '4px' }}>Business Hours</h4>
                      <p style={{ color: 'var(--text-lux-gray)', fontSize: '0.95rem' }}>
                        Monday - Sunday: 10:00 AM - 9:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mock Google Map */}
                <div className="luxury-card" style={{ padding: '12px', background: '#e5e7eb', display: 'flex', flexDirection: 'column', height: '400px', border: '1.5px solid var(--border-gold-strong)' }}>
                  <div style={{ flexGrow: 1, position: 'relative', background: '#cad2d3', overflow: 'hidden', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {/* Simulated Map layout with SVG elements */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.8 }}>
                      <svg width="100%" height="100%">
                        <line x1="0" y1="100" x2="600" y2="100" stroke="#fff" strokeWidth="12" />
                        <line x1="200" y1="0" x2="200" y2="400" stroke="#fff" strokeWidth="16" />
                        <line x1="0" y1="280" x2="600" y2="280" stroke="#fff" strokeWidth="8" />
                        <circle cx="200" cy="100" r="140" fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
                        {/* River representation */}
                        <path d="M 0 350 Q 150 320, 300 360 T 600 330" fill="none" stroke="#a5f3fc" strokeWidth="30" />
                      </svg>
                    </div>

                    <div style={{ zIndex: 10, textAlign: 'center', background: '#fff', padding: '16px 24px', borderRadius: '8px', boxShadow: 'var(--shadow-medium)', border: '1px solid var(--border-gold-soft)', maxWidth: '300px' }}>
                      <MapPin size={36} style={{ color: '#ef4444', margin: '0 auto 8px auto' }} />
                      <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--emerald-dark)' }}>Attar-E-Darbar</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-lux-gray)', margin: '4px 0' }}>Shibbari Chechakhata, Alipurduar, West Bengal 736124</p>
                      <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', textDecoration: 'underline', fontWeight: 'bold' }}>Open in Google Maps</a>
                    </div>
                  </div>
                  <div style={{ padding: '12px 6px 0 6px', fontSize: '0.8rem', color: 'var(--text-lux-gray)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 GPS: 26.5015° N, 89.5277° E</span>
                    <span>🗺️ Alipurduar Junction Area</span>
                  </div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    );
  };

  // ==========================================
  // PRODUCT CARD SUB-RENDERER
  // ==========================================
  const renderProductCard = (product) => {
    const activeSize = selectedSizes[product.id] || '3ml';
    const currentPrice = product.price[activeSize] || 99;
    
    return (
      <div key={product.id} className="luxury-card product-card animate-fade-in">
        {/* Real Product Image or Color Gradient representation */}
        {product.image ? (
          <div className="product-image-area" style={{ position: 'relative', overflow: 'hidden' }}>
            {product.isPremium && <span className="product-badge">Premium ✨</span>}
            {!product.isPremium && product.bestSeller && <span className="product-badge" style={{ background: 'var(--emerald-medium)' }}>Best Seller ⭐</span>}
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
            />
          </div>
        ) : (
          <div 
            className="product-image-area" 
            style={{ background: getGradientForCategory(product.category) }}
          >
            {product.isPremium && <span className="product-badge">Premium ✨</span>}
            {!product.isPremium && product.bestSeller && <span className="product-badge" style={{ background: 'var(--emerald-medium)' }}>Best Seller ⭐</span>}
            <div className="product-image-icon">{getIconForCategory(product.category)}</div>
            <div className="product-image-name">{product.name}</div>
          </div>
        )}

        <span className="product-family">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.profile}. Notes of {product.notes}.</p>
        
        {/* Metas */}
        <div className="product-meta-row">
          <span className="product-meta-item">Strength: <strong>{product.strength}</strong></span>
          <span className="product-meta-item">Longevity: <strong>{product.longevity}</strong></span>
        </div>
        <div className="product-meta-row" style={{ border: 'none', marginBottom: '8px' }}>
          <span className="product-meta-item">Occasion: <strong style={{ color: 'var(--gold-dark)' }}>{product.bestFor}</strong></span>
        </div>

        {/* Size pills */}
        <div className="size-price-selector">
          {Object.keys(product.price).map(sz => (
            <div 
              key={sz} 
              onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: sz }))}
              className={`size-pill ${activeSize === sz ? 'active' : ''}`}
            >
              {sz}
            </div>
          ))}
        </div>

        {/* Price & Add to Cart button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div className="price-box">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-lux-gray)' }}>₹</span>
            <span className="price-amount">{currentPrice}</span>
          </div>
          <button 
            className="btn-premium add-cart-btn" 
            style={{ width: 'auto', padding: '10px 16px' }}
            onClick={() => handleAddToCart(product, activeSize)}
          >
            Add +
          </button>
        </div>
      </div>
    );
  };


  // ==========================================
  // RENDER SELLER VIEW (ADMIN DASHBOARD)
  // ==========================================
  const renderSellerView = () => {
    if (!isAdminLoggedIn) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <div className="login-box animate-fade-in">
            <Lock size={48} style={{ color: 'var(--gold-rich)', margin: '0 auto 16px auto' }} />
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.6rem', marginBottom: '8px' }}>Seller Portal Access</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>Please authenticate using the owner's pass key.</p>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password" 
                placeholder="Enter Owner Passcode" 
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="admin-input"
                style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.15em' }}
              />
              {adminPasscodeError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '16px' }}>{adminPasscodeError}</p>}
              <button type="submit" className="btn-premium" style={{ width: '100%' }}>Authenticate</button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-container animate-fade-in" style={{ padding: '32px 24px' }}>
        
        {/* Sub Header for Portal Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #374151', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>Seller Management Suite</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Update inventory, fulfill incoming orders, and moderate reviews.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className={`admin-tab-btn ${adminTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setAdminTab('dashboard')}
            >
              Dashboard Metrics
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setAdminTab('inventory')}
            >
              Inventory ({products.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'orders' ? 'active' : ''}`}
              onClick={() => setAdminTab('orders')}
            >
              Orders Queue ({orders.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setAdminTab('reviews')}
            >
              Reviews Moderation
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setAdminTab('coupons')}
            >
              Coupons &amp; Offers ({coupons.length})
            </button>
            <button 
              className={`admin-tab-btn ${adminTab === 'gallery' ? 'active' : ''}`}
              onClick={() => setAdminTab('gallery')}
            >
              Exhibition Gallery ({galleryImages.length})
            </button>
          </div>
        </div>

        {/* DASHBOARD TAB CONTENT */}
        {adminTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* KPI metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="admin-card">
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' }}>Total Sales (Simulated)</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold-light)', fontFamily: 'var(--font-serif)' }}>₹{adminStats.sales}</div>
              </div>
              <div className="admin-card">
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' }}>Orders Placed</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60a5fa', fontFamily: 'var(--font-serif)' }}>{adminStats.ordersCount}</div>
              </div>
              <div className="admin-card">
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' }}>Total Inventory Items</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399', fontFamily: 'var(--font-serif)' }}>{adminStats.productsCount}</div>
              </div>
              <div className="admin-card">
                <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '4px' }}>Customer Rating Index</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24', fontFamily: 'var(--font-serif)' }}>⭐ {adminStats.avgRating}</div>
              </div>
            </div>

            {/* Dashboard breakdown panels */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="admin-card">
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>Storefront Categories Distribution</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(adminStats.categoryStats).map(([cat, count]) => (
                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{getIconForCategory(cat)} {cat}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '60%' }}>
                        <div style={{ flexGrow: 1, background: '#374151', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ background: 'var(--gold-rich)', height: '100%', width: `${(count / adminStats.productsCount) * 100}%` }}></div>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af', minWidth: '24px', textAlign: 'right' }}>{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card">
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '16px', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>Store Operations Context</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '12px' }}>
                  All modifications committed inside this Seller panel will instantly update the Customer views in real-time. To simulate customer purchases, go to the storefront, add items, and complete the check-out process.
                </p>
                <div style={{ background: '#374151', padding: '16px', borderRadius: '6px', borderLeft: '3px solid var(--gold-rich)' }}>
                  <h4 style={{ color: 'var(--gold-light)', fontSize: '0.95rem', marginBottom: '4px' }}>Attar-E-Darbar Contacts</h4>
                  <p style={{ fontSize: '0.8rem', color: '#d1d5db' }}>Phone numbers: 9832914801 (Srijani) / 8250585358 (Saikat)</p>
                  <p style={{ fontSize: '0.8rem', color: '#d1d5db' }}>Address: Shibbari Chechakhata, Alipurduar, West Bengal 736124</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY TAB CONTENT */}
        {adminTab === 'inventory' && (
          <div className="animate-fade-in">
            {editingProduct === null ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ color: '#fff' }}>Attar Inventory Database</h3>
                  <button className="btn-premium" onClick={handleAddNewProductClick}>
                    <Plus size={16} /> Add New Attar
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Profile</th>
                        <th>Strength</th>
                        <th>Prices (3/6/12ml)</th>
                        <th>Status Flags</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td style={{ fontWeight: '600', color: 'var(--gold-light)' }}>{p.name}</td>
                          <td>{getIconForCategory(p.category)} {p.category}</td>
                          <td style={{ fontSize: '0.8rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.profile}</td>
                          <td>{p.strength}</td>
                          <td>₹{p.price['3ml']}/₹{p.price['6ml']}/₹{p.price['12ml']}</td>
                          <td>
                            {p.isPremium && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', marginRight: '4px' }}>Premium</span>}
                            {p.bestSeller && <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', marginRight: '4px' }}>Seller</span>}
                            {p.newArrival && <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>New</span>}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleEditProductClick(p)} 
                                style={{ background: 'transparent', border: 'none', color: '#fbbf24', cursor: 'pointer' }}
                                title="Edit product"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id)} 
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                title="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // Add / Edit Product form
              <div className="admin-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h3 style={{ color: '#fff', marginBottom: '24px', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>
                  {editingProduct === 'new' ? 'Add New Attar Profile' : `Editing Attar: ${editingProduct.name}`}
                </h3>
                <form onSubmit={handleSaveProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Attar Name</label>
                      <input 
                        type="text" 
                        value={productForm.name} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="admin-input" 
                        placeholder="e.g. Kashmiri Khus"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Fragrance Family Category</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="admin-select"
                      >
                        {['Floral', 'Woody', 'Oudhy', 'Earthy', 'Musky', 'Sweet & Gourmand', 'Fresh & Aquatic', 'Inspired Fragrances'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Fragrance Profile</label>
                    <input 
                      type="text" 
                      value={productForm.profile} 
                      onChange={(e) => setProductForm(prev => ({ ...prev, profile: e.target.value }))}
                      className="admin-input" 
                      placeholder="e.g. Earthy, green petichor"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Main aromatic Notes</label>
                    <input 
                      type="text" 
                      value={productForm.notes} 
                      onChange={(e) => setProductForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="admin-input" 
                      placeholder="e.g. Vetiver, rain-clay oil, cedar"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Character</label>
                      <input 
                        type="text" 
                        value={productForm.character} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, character: e.target.value }))}
                        className="admin-input" 
                        placeholder="e.g. Calm and traditional"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Best For / Occasion</label>
                      <input 
                        type="text" 
                        value={productForm.bestFor} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, bestFor: e.target.value }))}
                        className="admin-input" 
                        placeholder="e.g. Summer mornings, puja"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Longevity (Hours)</label>
                      <select 
                        value={productForm.longevity} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, longevity: e.target.value }))}
                        className="admin-select"
                      >
                        <option value="6-8 Hours">6-8 Hours</option>
                        <option value="8 Hours">8 Hours</option>
                        <option value="8-10 Hours">8-10 Hours</option>
                        <option value="10-12 Hours">10-12 Hours</option>
                        <option value="12+ Hours">12+ Hours</option>
                        <option value="24 Hours">24 Hours</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Strength</label>
                      <select 
                        value={productForm.strength} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, strength: e.target.value }))}
                        className="admin-select"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Strong">Strong</option>
                      </select>
                    </div>
                  </div>

                  <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '12px 0 8px 0' }}>Price list by sizes (₹)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>3ml Price</label>
                      <input 
                        type="number" 
                        value={productForm.price3ml} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, price3ml: e.target.value }))}
                        className="admin-input" 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>6ml Price</label>
                      <input 
                        type="number" 
                        value={productForm.price6ml} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, price6ml: e.target.value }))}
                        className="admin-input" 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>12ml Price</label>
                      <input 
                        type="number" 
                        value={productForm.price12ml} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, price12ml: e.target.value }))}
                        className="admin-input" 
                      />
                    </div>
                  </div>
                  {/* Product Image Selection & File Upload */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '4px' }}>Product Image URL / Path (Optional)</label>
                        <input 
                          type="text" 
                          value={productForm.image} 
                          onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                          className="admin-input" 
                          placeholder="e.g. /my_attar_photo.jpg or data url"
                          style={{ marginBottom: 0 }}
                        />
                      </div>
                      <div style={{ flexShrink: 0, marginTop: '20px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Or upload file:</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProductForm(prev => ({ ...prev, image: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }}
                          id="product-image-file-upload"
                        />
                        <label 
                          htmlFor="product-image-file-upload" 
                          className="btn-premium" 
                          style={{ 
                            padding: '10px 16px', 
                            fontSize: '0.8rem', 
                            cursor: 'pointer',
                            display: 'inline-block',
                            textAlign: 'center',
                            borderRadius: '6px'
                          }}
                        >
                          📤 Choose Image
                        </label>
                      </div>
                    </div>

                    {productForm.image && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1f2937', padding: '10px', borderRadius: '8px', border: '1px solid #374151', width: 'fit-content' }}>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Preview:</span>
                        <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-gold-soft)' }}>
                          <img src={productForm.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setProductForm(prev => ({ ...prev, image: '' }))}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={productForm.isPremium} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, isPremium: e.target.checked }))}
                      />
                      Premium Tier
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={productForm.bestSeller} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, bestSeller: e.target.checked }))}
                      />
                      Best Seller Flag
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={productForm.newArrival} 
                        onChange={(e) => setProductForm(prev => ({ ...prev, newArrival: e.target.checked }))}
                      />
                      New Arrival Flag
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn-gold-outline" style={{ color: '#fff' }} onClick={() => setEditingProduct(null)}>Cancel</button>
                    <button type="submit" className="btn-premium">Save Attar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ORDERS QUEUE TAB CONTENT */}
        {adminTab === 'orders' && (
          <div className="animate-fade-in">
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Customer Orders Registry</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#1f2937', borderRadius: '8px' }}>
                <p style={{ color: '#9ca3af' }}>No customer orders placed yet. Simulate an order from the storefront shop!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(o => (
                  <div key={o.id} className="admin-card" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--gold-light)' }}>Order ID: {o.id}</span>
                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Ordered Date: {o.date}</span>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Customer Details:</h4>
                        <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}><strong>Name:</strong> {o.customerName}</p>
                        <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}><strong>Phone:</strong> {o.phone}</p>
                        <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}><strong>Shipping Address:</strong> {o.address}</p>
                      </div>

                      <div>
                        <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '4px' }}>Items ordered:</h4>
                        <ul style={{ paddingLeft: '20px', color: '#d1d5db', fontSize: '0.9rem' }}>
                          {o.items.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                              {item.name} ({item.size}) - ₹{item.price} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid #374151', paddingLeft: '24px', textAlign: 'right' }}>
                      <div>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '4px' }}>Grand Total</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', fontFamily: 'var(--font-serif)' }}>₹{o.total}</div>
                      </div>

                      <div style={{ margin: '16px 0' }}>
                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '6px' }}>Status</div>
                        <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {o.status === 'Pending' && (
                          <button 
                            onClick={() => updateOrderStatus(o.id, 'Dispatched')}
                            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Mark Dispatched
                          </button>
                        )}
                        {o.status === 'Dispatched' && (
                          <button 
                            onClick={() => updateOrderStatus(o.id, 'Delivered')}
                            style={{ background: '#059669', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button 
                          onClick={() => deleteOrder(o.id)}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS MODERATION TAB */}
        {adminTab === 'reviews' && (
          <div className="animate-fade-in">
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Reviews Moderation Portal</h3>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#1f2937', borderRadius: '8px' }}>
                <p style={{ color: '#9ca3af' }}>No customer feedback reviews found.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.map(rev => (
                  <div key={rev.id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', marginBottom: '6px' }}>
                        <span style={{ fontWeight: '600', color: 'var(--gold-light)' }}>{rev.name}</span>
                        <span className="stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{rev.date}</span>
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '0.95rem' }}>"{rev.comment}"</p>
                    </div>
                    <button 
                      onClick={() => deleteReview(rev.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px' }}
                      title="Delete review"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COUPONS & OFFERS TAB CONTENT */}
        {adminTab === 'coupons' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            {/* Active Coupons List */}
            <div className="admin-card">
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>Active Promo Coupons</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Value</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '700', color: 'var(--gold-light)' }}>{c.code}</td>
                        <td style={{ textTransform: 'capitalize' }}>{c.type === 'percentage' ? 'Percentage' : 'Flat Discount'}</td>
                        <td>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                        <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{c.description}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteCoupon(c.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                            title="Delete coupon"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Coupon Form */}
            <div className="admin-card" style={{ height: 'fit-content' }}>
              <h3 style={{ color: '#fff', marginBottom: '20px', borderBottom: '1px solid #374151', paddingBottom: '8px' }}>Create Promo Code</h3>
              <form onSubmit={handleAddCoupon}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Coupon Code</label>
                  <input 
                    type="text" 
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FESTIVE50"
                    style={{ textTransform: 'uppercase' }}
                    className="admin-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Discount Type</label>
                    <select 
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value)}
                      className="admin-select"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Value</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Coupon Description</label>
                  <input 
                    type="text" 
                    required
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. ₹50 off on total order"
                    className="admin-input"
                  />
                </div>

                <button type="submit" className="btn-premium" style={{ width: '100%' }}>Create Coupon</button>
              </form>
            </div>
          </div>
        )}

        {/* GALLERY MANAGER TAB CONTENT */}
        {adminTab === 'gallery' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            
            {/* Gallery Images List */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '16px' }}>Current Exhibition Gallery Images</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {galleryImages.map(img => (
                  <div key={img.id} className="admin-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ height: '140px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '1px solid #374151' }}>
                      <img src={img.url} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#d1d5db', fontWeight: '600', height: '36px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {img.caption}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', wordBreak: 'break-all' }}>
                      URL: {img.url}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(img.id)}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginTop: 'auto'
                      }}
                    >
                      Delete Image
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Gallery Image Form */}
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '16px' }}>Add Showcase Image</h3>
              <div className="admin-card">
                <form onSubmit={handleGalleryAdd}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Image URL / Path</label>
                        <input 
                          type="text" 
                          placeholder="e.g. /gallery_1.jpg or data url"
                          value={newGalleryUrl}
                          onChange={(e) => setNewGalleryUrl(e.target.value)}
                          className="admin-input"
                          style={{ marginBottom: 0 }}
                        />
                      </div>
                      <div style={{ flexShrink: 0, marginTop: '20px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Or upload:</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setNewGalleryUrl(reader.result);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }}
                          id="gallery-image-file-upload"
                        />
                        <label 
                          htmlFor="gallery-image-file-upload" 
                          className="btn-premium" 
                          style={{ 
                            padding: '10px 16px', 
                            fontSize: '0.8rem', 
                            cursor: 'pointer',
                            display: 'inline-block',
                            textAlign: 'center',
                            borderRadius: '6px'
                          }}
                        >
                          📤 Upload
                        </label>
                      </div>
                    </div>

                    {newGalleryUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1f2937', padding: '10px', borderRadius: '8px', border: '1px solid #374151', width: 'fit-content', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Preview:</span>
                        <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-gold-soft)' }}>
                          <img src={newGalleryUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setNewGalleryUrl('')}
                          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Image Caption</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Royal Aladdin Fragrance Urn"
                      value={newGalleryCaption}
                      onChange={(e) => setNewGalleryCaption(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <button type="submit" className="btn-premium" style={{ width: '100%' }}>Add Image to Gallery</button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>
    );
  };


  // ==========================================
  // CORE RENDER METHOD
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* OFFER MARQUEE ANNOUNCEMENT BAR */}
      {activeView === 'customer' && (
        <div className="offer-marquee-bar">
          <div className="marquee-content">
            <div className="marquee-item">
              ✨ GRAND INAUGURAL OFFER: BUY 2 GET 1 FREE ON ALL MINIATURE GIFT SETS! &nbsp;&bull;&nbsp; 
              🚚 FREE SHIPPING ON ORDERS ABOVE ₹499! &nbsp;&bull;&nbsp; 
              🌸 100% ALCOHOL-FREE PURE CONCENTRATED OIL BLENDS STARTING AT ₹99! &nbsp;&bull;&nbsp; 
              🎁 CUSTOM BULK GIFT PACKAGING AVAILABLE! &nbsp;&bull;&nbsp; 
              📞 CALL: 9832914801 / 8250585358 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div className="marquee-item">
              ✨ GRAND INAUGURAL OFFER: BUY 2 GET 1 FREE ON ALL MINIATURE GIFT SETS! &nbsp;&bull;&nbsp; 
              🚚 FREE SHIPPING ON ORDERS ABOVE ₹499! &nbsp;&bull;&nbsp; 
              🌸 100% ALCOHOL-FREE PURE CONCENTRATED OIL BLENDS STARTING AT ₹99! &nbsp;&bull;&nbsp; 
              🎁 CUSTOM BULK GIFT PACKAGING AVAILABLE! &nbsp;&bull;&nbsp; 
              📞 CALL: 9832914801 / 8250585358 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
      )}

      {/* HEADER PORTAL TRIGGER */}
      <header className="site-header">
        <div className="container header-container">
          <div className="brand-wrapper" style={{ cursor: 'pointer' }} onClick={() => { setActiveView('customer'); setCustomerTab('home'); }}>
            <img src="/logo.jpg" alt="Attar-E-Darbar Logo" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-name">Attar-E-Darbar</span>
              <span className="brand-tagline">A Fusion of Culture and Fragrance</span>
            </div>
          </div>

          {activeView === 'customer' ? (
            <>
              {/* Desktop Nav Links */}
              <nav className="desktop-nav">
                <button 
                  onClick={() => setCustomerTab('home')} 
                  className={`nav-link ${customerTab === 'home' ? 'active' : ''}`}
                >
                  HOME
                </button>
                <button 
                  onClick={() => { setSelectedCategory('All'); setCustomerTab('shop'); }} 
                  className={`nav-link ${customerTab === 'shop' ? 'active' : ''}`}
                >
                  SHOP
                </button>
                <button 
                  onClick={() => setCustomerTab('collections')} 
                  className={`nav-link ${customerTab === 'collections' ? 'active' : ''}`}
                >
                  COLLECTIONS
                </button>
                <button 
                  onClick={() => setCustomerTab('finder')} 
                  className={`nav-link ${customerTab === 'finder' ? 'active' : ''}`}
                >
                  FINDER
                </button>
                <button 
                  onClick={() => setCustomerTab('best-sellers')} 
                  className={`nav-link ${customerTab === 'best-sellers' ? 'active' : ''}`}
                >
                  BEST SELLERS
                </button>
                <button 
                  onClick={() => setCustomerTab('gift-sets')} 
                  className={`nav-link ${customerTab === 'gift-sets' ? 'active' : ''}`}
                >
                  GIFT SETS
                </button>
                <button 
                  onClick={() => setCustomerTab('about')} 
                  className={`nav-link ${customerTab === 'about' ? 'active' : ''}`}
                >
                  ABOUT
                </button>
                <button 
                  onClick={() => setCustomerTab('contact')} 
                  className={`nav-link ${customerTab === 'contact' ? 'active' : ''}`}
                >
                  CONTACT
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="header-actions">
                <button 
                  className="btn-shop-now"
                  onClick={() => { setSelectedCategory('All'); setCustomerTab('shop'); }}
                >
                  🛒 SHOP NOW
                </button>

                <button 
                  className="btn-cart-trigger"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag size={20} />
                  {cart.length > 0 && (
                    <span className="cart-badge">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>

                {/* Hamburger Toggle button */}
                <button 
                  className="hamburger-btn" 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Sliders size={22} style={{ transform: 'rotate(90deg)' }} />}
                </button>
              </div>
            </>
          ) : (
            // In Seller/Admin view
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-premium"
                onClick={() => setActiveView('customer')}
              >
                ← Storefront View
              </button>
              {isAdminLoggedIn && (
                <>
                  <button 
                    className="btn-gold-outline"
                    style={{ color: '#fff' }}
                    onClick={() => {
                      setChangePasskeyError('');
                      setChangePasskeySuccess('');
                      setNewPasskey('');
                      setConfirmPasskey('');
                      setIsChangePasskeyOpen(true);
                    }}
                  >
                    🔑 Change Passkey
                  </button>
                  <button 
                    className="btn-gold-outline"
                    style={{ color: '#fff' }}
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setAdminPasscode('');
                    }}
                  >
                    Logout Admin
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {activeView === 'customer' && isMobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <button 
              onClick={() => { setCustomerTab('home'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'home' ? 'active' : ''}`}
            >
              HOME
            </button>
            <button 
              onClick={() => { setSelectedCategory('All'); setCustomerTab('shop'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'shop' ? 'active' : ''}`}
            >
              SHOP
            </button>
            <button 
              onClick={() => { setCustomerTab('collections'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'collections' ? 'active' : ''}`}
            >
              COLLECTIONS
            </button>
            <button 
              onClick={() => { setCustomerTab('finder'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'finder' ? 'active' : ''}`}
            >
              FINDER
            </button>
            <button 
              onClick={() => { setCustomerTab('best-sellers'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'best-sellers' ? 'active' : ''}`}
            >
              BEST SELLERS
            </button>
            <button 
              onClick={() => { setCustomerTab('gift-sets'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'gift-sets' ? 'active' : ''}`}
            >
              GIFT SETS
            </button>
            <button 
              onClick={() => { setCustomerTab('about'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'about' ? 'active' : ''}`}
            >
              ABOUT
            </button>
            <button 
              onClick={() => { setCustomerTab('contact'); setIsMobileMenuOpen(false); }} 
              className={`mobile-nav-link ${customerTab === 'contact' ? 'active' : ''}`}
            >
              CONTACT
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              <button 
                className="btn-premium"
                style={{ width: '100%' }}
                onClick={() => { setSelectedCategory('All'); setCustomerTab('shop'); setIsMobileMenuOpen(false); }}
              >
                🛒 SHOP NOW
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CORE DISPLAY ROUTER */}
      <div style={{ flexGrow: 1, background: activeView === 'seller' ? '#111827' : 'var(--bg-lux-cream)' }}>
        {activeView === 'customer' ? renderCustomerView() : renderSellerView()}
      </div>

      {/* FOOTER AREA */}
      <footer style={{ background: 'var(--emerald-dark)', color: '#d1fae5', padding: '48px 0 24px 0', borderTop: '3px solid var(--gold-rich)', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ color: 'var(--gold-light)', fontSize: '1.4rem', marginBottom: '16px' }}>Attar-E-Darbar</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', opacity: 0.8 }}>
              Wrap yourself in traditional luxury. 100% alcohol-free concentrated oil blends formulated to preserve the pure aromatic richness of Indian heritage notes.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('customer'); setCustomerTab('home'); }}>Home Page</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('customer'); setCustomerTab('shop'); }}>Explore Storefront</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('customer'); setCustomerTab('finder'); }}>Fragrance Quiz Finder</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('customer'); setCustomerTab('gift-sets'); }}>Custom Gift Boxes</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('customer'); setCustomerTab('about'); }}>About &amp; Fragrance Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Store Address</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.85, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <MapPin size={16} style={{ flexShrink: 0, color: 'var(--gold-light)' }} />
              Shibbari Chechakhata, Alipurduar Junction,<br />
              Dist. Alipurduar, PIN - 736124, West Bengal
            </p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Call / Inquiries</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.85, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <Phone size={16} style={{ flexShrink: 0, color: 'var(--gold-light)' }} />
              9832914801 (Srijani Das)<br />
              8250585358 (Saikat)
            </p>
          </div>
        </div>
        <div className="container" style={{ borderTop: '1px solid rgba(197, 160, 89, 0.2)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', fontSize: '0.8rem', opacity: 0.7 }}>
          <span>© 2026 Attar-E-Darbar Fragrances. All Rights Reserved.</span>
          <span 
            onClick={handleFooterSecretClick} 
            style={{ cursor: 'default', userSelect: 'none' }}
            title="Designed with Indian Cultural Heritage."
          >
            Designed with Indian Cultural Heritage.
          </span>
        </div>
      </footer>

      {/* SHOPPING CART DRAWER PANEL */}
      <div className={`cart-drawer-backdrop ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3 className="cart-title">Your Scent Bag ({cart.length})</h3>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}><X size={24} /></button>
        </div>

        <div className="cart-items-wrapper">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-lux-gray)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
              <p>Your scent bag is currently empty.</p>
              <button className="btn-gold-outline" style={{ marginTop: '16px' }} onClick={() => { setIsCartOpen(false); setCustomerTab('shop'); }}>Go Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">Size: {item.size} | Category: {item.category}</div>
                  <div className="cart-item-qty-row">
                    <button className="qty-btn" onClick={() => updateCartQty(item.cartItemId, -1)}><Minus size={12} /></button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateCartQty(item.cartItemId, 1)}><Plus size={12} /></button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cart-item-price">₹{item.price * item.quantity}</div>
                  <button className="cart-remove-btn" onClick={() => removeCartItem(item.cartItemId)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            {/* Coupon Code Section */}
            <div style={{ borderBottom: '1px solid var(--border-gold-soft)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--emerald-dark)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Apply Promo Coupon</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', fontWeight: 'normal' }}>Try "DARBAR10"</span>
              </div>
              
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter coupon code..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid var(--border-gold-soft)', borderRadius: '6px', fontSize: '0.85rem', textTransform: 'uppercase' }}
                  />
                  <button 
                    type="submit" 
                    className="btn-premium" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', letterSpacing: '0.05em' }}
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--emerald-soft)', border: '1px solid var(--emerald-light)', padding: '8px 12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--emerald-medium)' }}>
                    <strong>{appliedCoupon.code}</strong> Applied!
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#059669', fontSize: '0.75rem', marginTop: '6px' }}>{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-lux-gray)' }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '600' }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '700', color: 'var(--emerald-dark)', borderTop: '1px solid var(--border-gold-soft)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-lux-gray)', marginBottom: '16px' }}>100% Cash on Delivery &amp; Store Pickup simulation.</p>
            <button 
              className="btn-premium cart-checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutModalOpen(true);
              }}
            >
              Secure Checkout (₹{cartTotal})
            </button>
          </div>
        )}
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setIsCheckoutModalOpen(false)}>
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--emerald-dark)', borderBottom: '1px solid var(--border-gold-soft)', paddingBottom: '12px', marginBottom: '24px' }}>
              Finalize Scent Order
            </h3>

            <form onSubmit={handleCheckoutSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Recipient's Full Name</label>
                <input 
                  type="text" 
                  required
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Souvik Mandal"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', background: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Mobile Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={checkoutForm.phone}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. 98329XXXXX"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', background: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Complete Delivery Address</label>
                <textarea 
                  rows="3" 
                  required
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street name, landmark, town, PIN code"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', background: '#fff', resize: 'vertical' }}
                />
              </div>

              <div style={{ borderTop: '1px dashed var(--border-gold-soft)', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem' }}>
                  <span>Order Total:</span>
                  <span style={{ color: 'var(--emerald-medium)' }}>₹{cartTotal}</span>
                </div>
              </div>

              <button type="submit" className="btn-premium" style={{ width: '100%' }}>Confirm Simulated Purchase</button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS ORDER CONFIRMATION MODAL */}
      {orderSuccess && (
        <div className="modal-overlay" onClick={() => setOrderSuccess(null)}>
          <div className="modal-content animate-fade-in" style={{ textAlign: 'center', maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <CheckCircle size={56} style={{ color: '#059669', margin: '0 auto 16px auto' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--emerald-dark)', marginBottom: '8px' }}>Order Placed!</h3>
            <p style={{ color: 'var(--text-lux-gray)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Your simulated order with ID <strong>{orderSuccess.id}</strong> has been generated.
            </p>
            <div style={{ background: 'var(--bg-lux-cream)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-gold-soft)', fontSize: '0.8rem', textAlign: 'left', marginBottom: '24px' }}>
              <p><strong>Recipient:</strong> {orderSuccess.customerName}</p>
              <p><strong>Total Price:</strong> ₹{orderSuccess.total}</p>
              <p><strong>Address:</strong> {orderSuccess.address}</p>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-lux-gray)', marginBottom: '20px' }}>
              💡 This simulated purchase has been sent to the owner's orders database.
            </p>
            <button className="btn-premium" style={{ width: '100%' }} onClick={() => setOrderSuccess(null)}>Back to Storefront</button>
          </div>
        </div>
      )}

      {/* CHANGE PASSKEY MODAL */}
      {isChangePasskeyOpen && (
        <div className="modal-overlay" onClick={() => setIsChangePasskeyOpen(false)}>
          <div className="modal-content animate-fade-in" style={{ maxWidth: '400px', background: '#1f2937', border: '1.5px solid var(--border-gold-strong)', color: '#fff' }} onClick={(e) => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setIsChangePasskeyOpen(false)}>
              <X size={20} />
            </button>
            
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-light)', borderBottom: '1px solid #374151', paddingBottom: '12px', marginBottom: '20px' }}>
              Change Admin Passcode
            </h3>

            <form onSubmit={handleChangePasskeySubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>New Passcode</label>
                <input 
                  type="password"
                  required
                  placeholder="Enter new passcode"
                  value={newPasskey}
                  onChange={(e) => setNewPasskey(e.target.value)}
                  className="admin-input"
                  style={{ background: '#111827', border: '1px solid #374151', color: '#fff' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '6px' }}>Confirm Passcode</label>
                <input 
                  type="password"
                  required
                  placeholder="Retype new passcode"
                  value={confirmPasskey}
                  onChange={(e) => setConfirmPasskey(e.target.value)}
                  className="admin-input"
                  style={{ background: '#111827', border: '1px solid #374151', color: '#fff' }}
                />
              </div>

              {changePasskeyError && (
                <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '16px' }}>
                  ❌ {changePasskeyError}
                </p>
              )}

              {changePasskeySuccess && (
                <p style={{ color: '#059669', fontSize: '0.8rem', marginBottom: '16px' }}>
                  ✅ {changePasskeySuccess}
                </p>
              )}

              <button type="submit" className="btn-premium" style={{ width: '100%' }}>Update Passcode</button>
            </form>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      {activeView === 'customer' && (
        <a 
          href="https://wa.me/918250585358?text=Hello%20Attar-E-Darbar,%20I'm%20interested%20in%20your%20attars!"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <div className="whatsapp-pulse"></div>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.488 4.957 1.49 5.361 0 9.725-4.37 9.728-9.742.001-2.603-1.012-5.051-2.855-6.896-1.844-1.844-4.29-2.858-6.895-2.859-5.368 0-9.73 4.37-9.733 9.743-.001 1.776.467 3.51 1.353 5.044l-.946 3.457 3.548-.93zm8.382-5.3c-.372-.188-2.202-1.086-2.546-1.211-.344-.125-.595-.188-.846.188-.251.375-.97 1.211-1.189 1.462-.22.25-.439.281-.811.094-.372-.188-1.57-.578-2.992-1.847-1.107-.988-1.854-2.207-2.072-2.583-.219-.375-.024-.578.163-.765.168-.168.372-.438.558-.656.188-.219.25-.375.375-.625.125-.25.063-.469-.031-.656-.094-.188-.846-2.031-1.157-2.781-.304-.73-.613-.63-.846-.642-.219-.012-.47-.012-.72-.012-.25 0-.658.094-.99.456-.332.362-1.267 1.238-1.267 3.018 0 1.781 1.298 3.5 1.479 3.75.181.25 2.555 3.902 6.19 5.474.864.374 1.538.597 2.063.764.868.276 1.659.237 2.284.143.697-.105 2.202-.9 2.515-1.768.313-.869.313-1.613.219-1.768-.093-.156-.344-.25-.716-.438z"/>
          </svg>
        </a>
      )}

    </div>
  );
}

export default App;

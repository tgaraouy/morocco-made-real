# Admin Interface & Content Validation Setup

## 🚀 Quick Start

### 1. Run the Database Migration

First, run the experience submissions migration in your Supabase dashboard:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Open your project: `xwtyhpwmplcqprtzrirm`
3. Navigate to **SQL Editor**
4. Copy and paste the content from `supabase/migrations/009_experience_submissions.sql`
5. Click **Run** to execute the migration

### 2. Access the Admin Interface

Navigate to the admin interface:
```
http://localhost:3000/admin/experiences
```

## 📋 Features Overview

### **Submit Experience Tab**
- ✅ Complete form for artisan experience submission
- ✅ Form validation with required fields
- ✅ Blockchain certification generation
- ✅ Save as draft or submit for review
- ✅ Interactive content sections (audio, video, cultural context)

### **Review Submissions Tab** 
- ✅ View all pending submissions
- ✅ Approve/reject with one click
- ✅ Review experience details
- ✅ Admin approval workflow

### **Approved Experiences Tab**
- ✅ View all approved and live experiences
- ✅ Statistics and metrics
- ✅ Experience management

### **Analytics Tab**
- ✅ Submission statistics
- ✅ Artisan metrics
- ✅ Performance tracking

## 🔄 Validation Workflow

### 1. **Artisan Submission**
```
Draft → Submit for Review → Pending
```

### 2. **Admin Review**
```
Pending → Approve → Live Experience
        → Reject → Rejected (with reason)
```

### 3. **Blockchain Certification**
Each approved experience automatically gets:
- ✅ Artisan verification ID
- ✅ Heritage authenticity certificate
- ✅ Skill certification
- ✅ Community endorsement
- ✅ Blockchain hash for verification

## 🧪 Testing the System

### Test Data Available
The migration includes 2 sample pending submissions:

1. **Amina's Sacred Pottery Rituals** (Safi)
   - Price: €85
   - Duration: 5 hours
   - Status: Pending review

2. **Khadija's Atlas Mountain Weaving Sanctuary** (Atlas Mountains)
   - Price: €120
   - Duration: 8 hours
   - Status: Pending review

### Test the Workflow
1. Go to **Review Submissions** tab
2. See the 2 pending submissions
3. Click **Approve** on one experience
4. Check **Approved Experiences** tab to see it appear there
5. Go to `/cultural-match` to see it in the main experience feed

## 🎯 Admin Actions

### **Approve Submission**
```javascript
// Automatically creates experience in main database
// Generates blockchain certification
// Updates submission status to 'approved'
// Makes experience live and searchable
```

### **Reject Submission**
```javascript
// Prompts for rejection reason
// Updates submission status to 'rejected'
// Sends feedback to artisan
// Preserves submission for future editing
```

### **Form Validation**
- ✅ Required fields validation
- ✅ Price must be > 0
- ✅ Age validation (0-150)
- ✅ Real-time error display
- ✅ Complete form before submission

## 🔐 Security Features

### Row Level Security (RLS)
- ✅ Artisans can only see their own submissions
- ✅ Admins can see all submissions
- ✅ Public can only see approved experiences
- ✅ Authentication-based access control

### Data Validation
- ✅ Server-side validation in database
- ✅ Type checking and constraints
- ✅ Sanitized input handling
- ✅ Blockchain verification

## 🔍 **Multilingual Search Features**

### **Language Priority**
The search system prioritizes languages in the following order:
1. **🇫🇷 French (Primary)** - Main search language for Moroccan users
2. **🇬🇧 English (Secondary)** - For international tourists
3. **🇸🇦 Arabic (Third)** - Native language support

### **Search Vector Configuration**
```sql
search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('french', 
      title || ' ' || artisan_name || ' ' || craft || ' ' || 
      location || ' ' || description || ' ' || 
      COALESCE(artisan_experience, '') || ' ' ||
      array_to_string(tags, ' ') || ' ' ||
      array_to_string(languages, ' ')
    )
  ) STORED
```

### **Available Search Functions**
- `searchSubmissions(query, status?)` - Default French search
- `searchSubmissionsMultilingual(query, language, status?)` - Language-specific search
- `search_experiences_multilingual(search_query, search_language)` - Database function

## 📊 Database Schema

### **experience_submissions table**
```sql
- id (UUID, Primary Key)
- title, artisan_name, craft, location
- price, duration, description
- artisan_age, artisan_experience
- languages[], tags[], quick_moods[]
- interactive_content (JSONB)
- status ('draft', 'pending', 'approved', 'rejected')
- submitted_at, reviewed_at
- reviewer_notes, rejection_reason
- search_vector (Full-text search)
```

### **Functions Available**
- `submit_experience_for_review(submission_id)`
- `approve_experience_submission(submission_id, reviewer_id, notes)`
- `reject_experience_submission(submission_id, reviewer_id, reason, notes)`
- `get_submission_stats()`
- `get_artisan_submissions(artisan_email)`
- `generate_blockchain_certification(submission_id)`

## 🚀 Production Readiness

### What's Complete ✅
- ✅ Full submission workflow
- ✅ Admin approval interface
- ✅ Database schema with constraints
- ✅ Blockchain certification system
- ✅ Search and analytics
- ✅ Security policies
- ✅ Error handling with fallbacks

### Next Steps 🔄
- 🔄 Email notifications for status changes
- 🔄 Advanced analytics dashboard
- 🔄 Batch approval actions
- 🔄 Experience editing interface
- 🔄 Media upload for images/videos

## 🎨 UI Components

The admin interface uses:
- **Radix UI** for accessible components
- **Tailwind CSS** for styling
- **Lucide Icons** for iconography
- **shadcn/ui** design system
- **Morocco-inspired color palette**

## 🔗 Integration

### With Existing Systems
- ✅ Integrates with current `cultural_experiences` table
- ✅ Uses existing Supabase connection
- ✅ Compatible with cultural-match interface
- ✅ Works with existing navigation
- ✅ Maintains current user experience

### API Endpoints
The system works through:
- Supabase client-side queries
- Database functions (RPC calls)
- Real-time subscriptions (future)
- RESTful patterns

---

## 🎉 Ready to Use!

Your **Morocco Made Real** platform now has a complete content management system for artisans to submit authentic cultural experiences that get validated and certified before going live!

Visit: `http://localhost:3000/admin/experiences` to start managing content! 🇲🇦✨ 
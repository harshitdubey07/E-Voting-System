# E-Voting System: Features & Functionality Guide

This document lists all the features implemented in the current E-Voting system (MongoDB Edition). Use this as a checklist for development and testing.

## 🔐 Authentication & Security
- **Voter Master Validation**: Only pre-approved Voter IDs can register.
- **Secure Registration**: Password hashing using `bcrypt`.
- **JWT Login**: Secure token-based sessions for voters and admins.
- **Authorization Middleware**: Protects voting and admin routes from unauthorized access.
- **Environment Management**: Securely handles DB URIs and secrets via `.env`.

## 🗳️ Voting System
- **Active Election Control**: Voting is only allowed when the Admin has started the election.
- **Candidate Selection**: Real-time listing of all candidates.
- **Single Vote Enforcement**: Prevents a voter from casting more than one vote.
- **Anonymous Voting**: Votes are recorded as references but kept private.

## 📊 Results & Analytics
- **Real-time Results**: Live vote count for all candidates.
- **Progress Visualization**: (Planned) Visual bars showing vote distribution.
- **Winner Announcement**: Real-time calculation and display of the current leader/winner.

## 👑 Admin Capabilities
- **Election Start/Stop**: Instant control over the voting phase.
- **Candidate Management**:
    - Add new candidates.
    - Remove candidates by ID.
- **Advanced Monitoring**: (Planned) View total registered voters vs. total votes cast.

## 🎨 UI/UX (Implementation Phase)
- **Glassmorphism/Aurora Design**: Modern and premium aesthetic.
- **High-Contrast Visibility**: Ensured readability on all displays.
- **Responsive Layout**: Works seamlessly on Mobile, Tablet, and Desktop.
- **Toast Notifications**: Professional feedback for every action (success/error).

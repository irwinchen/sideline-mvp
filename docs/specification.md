# Sideline

## What is it?

Sideline is a digital service that makes it easy for anyone with food allergies (or other food restrictions) to effortlessly communicate their needs to other people, restaurants and businesses.

This eliminates confusion and miscommunication, and reduces friction for both the person who has those needs, as well as those who are obligated to address them.

For food service providers at any scale, it simplifies decision-making and increases customer experience and trust, allowing front- and back-of-the-house to easily verify that they are serving a safe meal to their customers.

An aspect of the problem to solve is:

- My health, wellbeing and outcomes have information I must convey to providers
- The providers are anonymous, opaque, multi-faceted, and multi-lingual
- **Thus, there’s no reliable way for that information to be conveyed**

Sideline is the means by which that critical information is always delivered accurately, at the right time, in the right language, with a means of knowing that the information has been delivered.

## How does it work?

Sideline is a web app. Users create a profile for themselves, listing any food-related pathologies and preferences they have, from a list of all possible food allergies and restrictions. This becomes their Sideline Profile.

When the user creates a Sideline Profile and a username, it generates:

**Back end:**

- a data record of their restrictions, which they can modify later as needed

**Front end:**

- a digital card that can be saved to Apple Wallet or Google Wallet
- a simple URL (e.g., sideline.menu/irwin) that they can send to anyone

The Sideline Profile is a standalone document/record that can then be easily transferred to, presented to, and referenced by, any institution (e.g., restaurants, hotels, airlines) as well as individuals (e.g.,dinner parties, weddings) when they are preparing or serving food for the user.

- \*\*Transfer of the Sideline Profile (IN ADVANCE):

Build around respectful discretion\*\*

By email, text message, copy/paste, or reference over the phone, the User can send their profile to anyone with a link or provide relevant lookups - the URL is a persistent pseudonymous profile
(e.g., “sideline.menu/349hasJg1jn”) - the phone number is _associated and embedded in the record_ but is never _visible in the record,_ and cannot be used as a lookup _except by licensed commercial users_

    The Provider can access the profile in the system by using that phone number (in the case of a commercial license) or by pseudonymous username.

    This could be in the Provider context of a reservation for a restaurant, hotel, or flight (e.g.), or for anyone planning a party or a wedding (e.g.).

    When viewed by any Provider (commercial or personal) this becomes associated with the record, and delivers a notification that it has been viewed by that Provider

- **Presentation of the Sideline Profile (ONSITE):**

Using the **browser in their mobile**, or the **digital card in their phone’s wallet**, the Member can present the screen with their Sideline Profile, in person, to a Provider (e.g., a waiter)

Whether in the browser, or in the digital card, the Sideline Profile has their member name, a list of their restrictions, and a QR code that links to the profile.

Any Provider (e.g., a waiter) can scan that QR code with another phone and receive the detailed Profile of the user.

When the Provider scans the QR code, the detailed profile of the Member appears, along with a language selection dropdown. The relevant food restrictions are translated into whatever they select. This is crucial when traveling, but also in most major metropolitan areas, where English may not be a first and fluent language.

This profile, now in any language on a Provider’s phone, can be presented by the Provider anywhere on site (e.g., the kitchen, the manager, the caterer, etc.)

To note: the Provider’s phone doing the scanning of the Member’s code has a language dropdown, that can be modified (by the Provider) at any time, e.g., they receive the information in Spanish, but can select Chinese when presenting the information to another Provider onsite.

- **Referencing** the Sideline Profile

For Providers, they can access the Member profile

- Directly by Member
  - using the Sideline hashtag URL provided by Member in text/email
  - QR code of the hashtag URL provided by Member in person
- Referred to by Member
  - by doing a lookup of cell phone number (**Commercial Licensing only**, e.g., a restaurant)
  Note: For MVP, we are not considering use cases for Aggregators (like OpenTable, Seamless, et al) or complex systems (like airlines, how do they transfer like “vegetarian meal?”)

**Access to profiles**

- For individuals (e.g., party, wedding): Access is free (but capped at 15 lookups/month)
- For Provider institutions (e.g., restaurant, hotel, airline): they are charged a subscription fee for Commercial Access to as many profiles as they request
- For Users: a user can provide direct access their profile by presenting a QR code from their digital wallet. For institutions, if they are not already subscribed to Commercial Access, they can scan 3 such codes/day before requiring an upgrade.

## User Roles

There are two main user roles (plus Admin):

1. **Members**: any individual with a food allergy or restriction that wants to communicate this easily when they are dining out, ordering out, or in a group meal environment.
2. **Providers:** anyone
   1. communicating food restrictions to people who prepare the food (e.g., a waiter, food service director, or a wedding planner) and
   2. anyone who is actually preparing the food (e.g., a chef)
3. **Admins**: Have superuser control to manage all user data.

## User Stories

### Member Flow

- Member views service information,
  - reviews benefits and
  - general approach to privacy
- Member selects to create an account using Clerk Auth
- Member enters preferred email address and phone number
  - Standard validation flow for these fields
- Member views brief overview of plain English t&c including HIPAA, privacy
  - Member provides consent
  **CORE PROFILE CREATION/EDIT FLOW:**
- Member can type into chat what their overall considerations, or specifics. Examples:
  - “I’m vegetarian, but can’t eat nightshades”
  - “I’m kosher, and have celiac”
  - “I’m pre-diabetic”
- Member is notified of basis of suggested restrictions with note these can be modified
  - Accept/Reject this basis
- List is pre-populated based on that chat
- Member can Modify specifics
  - select/deselect/change categorization (e.g., change “Do Not Serve” to “Please Inform”)
  - or accept as recommended
- Member can categorize each restriction selected with
  - 🔴 which indicates DO NOT SERVE, or
  - 🟡 which means INFORM SENSITIVITY
- Member fills out any FAQ questions they want to share (with some prompts)
- Member selects to save Profile information.
- Member reviews what’s in the profile and chooses to
  - approve or
  - edit (return to core flow)
- Member selects to store profile to digital wallet
  - If on mobile browser: Option send to digital wallet
  - If on PC: Option send text message with link to wallet add function
- Member reviews shareable URL (”you can send this anyone right now, share”)
- Backstage, shareable URL and copy of digital card send to associated email and text
- **Returning user only:** Member selects to Edit their profile information or preferences (standard edit pattern).

### Provider Flow

- **General Provider** (e.g., wedding, dinner party)
  - Advance: receives URL that resolves
- Ideal is: non-commercial provider does NOT need to make an account in order to view a profile
- **Commercial Provide** (e.g., restaurant)
  - Provider views information informing them about the benefits of signing up, and pricing information.
- Provider selects to create (or claim) an account associated with an organization or institution. 💬 let’s talk about this
- Provider submits information that validates their identity.
- Provider views list of standard food handling practices and guidelines their organization adheres to, including usage of local, organic, specialty ingredients and selects any that apply to their organization.
- Provider selects to save Profile information
- Provider views all users that have added them to their profile
- Provider selects to view a user's profile (via url or QR code); (This action gets recorded by the system and is throttled depending on level/status of FSP. If profile has already been viewed or saved?)
- Provider views Top-Level Restrictions for a user's profile
- Provider looks up Member profile using phone number
  - If not commercial provider, they get an upsell
  - If commercial provider, they view Member profile information

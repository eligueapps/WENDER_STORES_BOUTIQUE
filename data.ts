import { Product, Category, Order } from './types';

export const initialCategories: Category[] = [
  { 
    id: 1, 
    name: 'Stores Enrouleurs',
    description: 'Simples, élégants et fonctionnels, parfaits pour un look moderne.',
    image: 'https://picsum.photos/seed/cat1/200/200'
  },
  { 
    id: 2, 
    name: 'Stores Vénitiens',
    description: 'Contrôle précis de la lumière avec un style classique et durable.',
    image: 'https://picsum.photos/seed/cat2/200/200'
  },
  { 
    id: 3, 
    name: 'Rideaux Plissés',
    description: 'Texture douce et tombé élégant pour une atmosphère chaleureuse.',
    image: 'https://picsum.photos/seed/cat3/200/200'
  },
  { 
    id: 4, 
    name: 'Stores Romains',
    description: 'Se replient en accordéon pour un style sophistiqué et intemporel.',
    image: 'https://picsum.photos/seed/cat4/200/200'
  },
];

export const initialTags: string[] = ['cuisine', 'salon', 'chambre', 'bureau', 'occultant', 'tamisant', 'moderne', 'classique'];

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Linen Roller Blind',
    description: 'A beautiful and simple linen roller blind, perfect for creating a soft, natural look in any room. Provides privacy while gently filtering light.',
    pricePerSqM: 55.00,
    images: ['https://picsum.photos/seed/blind1/800/600', 'https://picsum.photos/seed/blind1-detail/800/600'],
    categoryId: 1,
    tags: ['salon', 'chambre', 'tamisant', 'moderne'],
    isNewArrival: true,
    isBestSeller: true,
    technicalSheetUrl: '#',
    installationGuideUrl: '#',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    howToMeasureText: 'Pour une pose murale, mesurez la largeur de votre fenêtre et ajoutez 10cm de chaque côté. Pour la hauteur, mesurez du haut de l\'encadrement jusqu\'à l\'endroit où vous souhaitez que le store se termine.',
    howToInstallText: 'Fixez les supports au mur ou au plafond en utilisant les vis fournies. Assurez-vous qu\'ils sont de niveau. Clipsez ensuite le store dans les supports. C\'est aussi simple que cela !',
  },
  {
    id: 2,
    name: 'Aluminum Venetian Blind',
    description: 'Sleek and durable, our aluminum Venetian blinds offer precise light control with a modern aesthetic. Ideal for kitchens and offices.',
    pricePerSqM: 65.00,
    images: ['https://picsum.photos/seed/blind2/800/600', 'https://picsum.photos/seed/blind2-detail/800/600'],
    categoryId: 2,
    tags: ['cuisine', 'bureau', 'moderne'],
    isNewArrival: false,
    isBestSeller: true,
    technicalSheetUrl: '#',
  },
  {
    id: 3,
    name: 'Blackout Pleated Curtain',
    description: 'Experience complete darkness with our premium blackout pleated curtains. Perfect for bedrooms and media rooms for undisturbed rest.',
    pricePerSqM: 72.50,
    images: ['https://picsum.photos/seed/curtain1/800/600', 'https://picsum.photos/seed/curtain1-detail/800/600'],
    categoryId: 3,
    tags: ['chambre', 'occultant'],
    isNewArrival: true,
    isBestSeller: false,
    howToInstallText: 'Installez la tringle au-dessus de votre fenêtre. Enfilez les anneaux du rideau sur la tringle. Répartissez les plis uniformément pour un rendu élégant.',
  },
  {
    id: 4,
    name: 'Classic Roman Shade',
    description: 'Add a touch of elegance with our classic Roman shades. They stack up evenly when being opened, and are visibly smooth when closed.',
    pricePerSqM: 85.00,
    images: ['https://picsum.photos/seed/shade1/800/600', 'https://picsum.photos/seed/shade1-detail/800/600'],
    categoryId: 4,
    tags: ['salon', 'classique'],
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: 5,
    name: 'Wooden Venetian Blind',
    description: 'Bring the warmth of natural wood into your home. Our wooden Venetian blinds are stylish, timeless, and offer excellent light control.',
    pricePerSqM: 95.00,
    images: ['https://picsum.photos/seed/blind3/800/600', 'https://picsum.photos/seed/blind3-detail/800/600'],
    categoryId: 2,
    tags: ['salon', 'bureau', 'classique'],
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: 6,
    name: 'Sheer Pleated Curtain',
    description: 'Light and airy, these sheer pleated curtains allow maximum daylight while maintaining a degree of privacy. Perfect for a layered window treatment.',
    pricePerSqM: 48.00,
    images: ['https://picsum.photos/seed/curtain2/800/600', 'https://picsum.photos/seed/curtain2-detail/800/600'],
    categoryId: 3,
    tags: ['salon', 'tamisant'],
    isNewArrival: false,
    isBestSeller: false,
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    address: '123 Main St, Anytown, USA',
    email: 'john.doe@example.com',
    phone: '555-1234',
    items: [
      {
        id: '1-1672532400000',
        product: initialProducts[0],
        // FIX: Corrected `mechanismType` from 'roller' to 'manuel' and `mountingType` from 'wall' to 'murale' to match the Customization type. Added missing `withBox` property.
        customization: { width: 120, height: 150, mechanismType: 'manuel', mechanismSide: 'right', mountingType: 'murale', withBox: false },
        quantity: 2,
        surface: 3.6,
        totalPrice: 198
      }
    ],
    total: 213.00,
    status: 'Livrée',
    date: new Date('2023-10-26'),
    paymentStatus: 'Payé',
    deliveryFee: 15.00,
    callStatus: 'Appelé',
    callDate: '2023-10-25',
    paymentMethod: 'Carte bancaire',
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    address: '456 Oak Ave, Anytown, USA',
    email: 'jane.smith@example.com',
    phone: '555-5678',
    items: [],
    total: 180.00,
    status: 'Expédiée',
    date: new Date('2023-10-28'),
    paymentStatus: 'Payé',
    deliveryFee: 15.00,
    callStatus: 'Appelé',
    callDate: '2023-10-27'
  },
  {
    id: 'ORD003',
    customerName: 'Peter Jones',
    address: '789 Pine Ln, Anytown, USA',
    email: 'peter.jones@example.com',
    phone: '555-9012',
    items: [],
    total: 350.75,
    status: 'En traitement',
    date: new Date('2023-10-30'),
    paymentStatus: 'En attente de paiement',
    deliveryFee: 15.00
  },
];

export const initialTermsAndConditions = `
<h2 class="text-2xl font-bold mb-4">Conditions Générales de Vente</h2>
<p class="mb-4">Bienvenue chez WENDER STORES. Ces conditions générales décrivent les règles et règlements pour l'utilisation de notre site Web et de nos services.</p>
<h3 class="text-xl font-bold mb-2">1. Interprétation et Définitions</h3>
<p class="mb-4">Les mots dont la première lettre est en majuscule ont des significations définies dans les conditions suivantes. Les définitions suivantes auront la même signification qu'elles apparaissent au singulier ou au pluriel.</p>
<h3 class="text-xl font-bold mb-2">2. Commandes sur mesure</h3>
<p class="mb-4">Tous nos produits sont fabriqués sur mesure selon vos spécifications. Veuillez vous assurer que toutes les mesures et options sont correctes avant de passer votre commande. Nous ne sommes pas responsables des mesures incorrectes fournies par le client.</p>
<h3 class="text-xl font-bold mb-2">3. Retours et Remboursements</h3>
<p class="mb-4">En raison de la nature personnalisée de nos produits, nous ne pouvons accepter les retours ou offrir des remboursements pour des raisons autres que des défauts de fabrication. Si vous pensez que votre produit présente un défaut, veuillez nous contacter dans les 7 jours suivant la réception.</p>
`;
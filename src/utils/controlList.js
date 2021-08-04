import routeList from '../routeList'

export const controlList = [
    {
        type: 'category',
        name: 'Maintenance',
        class: 'hex-0',
        mainHeadingClass: 'maintain',
    },
    {
        type: 'menu',
        mainHeading: 'Restore Ownership',			
        subHeading: 'Get a list of all patents with broken chain of title, investigate with your team, and automatically correct the records.',
        svg: ``,
        image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/restore_ownership.png',
        class: 'hex-1',
        breadCrumbs: 'Maintenance > Restore Ownership',
        category: 'restore_ownership',
        layout_id: 1,
        showSvg: false,
        mainHeadingClass: 'maintain',
        redirect: routeList.restore_ownership
    },
    {
        type: 'menu',
        mainHeading: 'Pay Maintenance Fee',
        subHeading: 'Get a list of all patents due for payment, discuss with your team whether to maintain each one, and pay directly with the Patent Office.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/pay_maintainence_fees.png`,
        class: 'hex-3',
        breadCrumbs: 'Maintenance > Pay Maint. Fee',
        category: 'pay_maintainence_fee',
        layout_id: 3,
        showSvg: false,
        mainHeadingClass: 'maintain',
        redirect: routeList.pay_maintainence_fee
    },    
    {
        type: 'menu',
        mainHeading: 'Clean Encumbrances',
        subHeading: 'Get a list of patents that are encumbared with third party rights that are likely removable.',
        svg: '',
        image: 'https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/clean_encumbrances.png',
        class: 'hex-2',
        breadCrumbs: 'Maintenance > Clean Encumbrances',
        category: 'clear_encumbrances',
        layout_id: 2,
        showSvg: false,
        mainHeadingClass: 'maintain', 
        redirect: routeList.clear_encumbrances
    },
    {
        type: 'menu',
        mainHeading: 'Correct Names',
        subHeading: 'Get a list of patents and assignments filed with incorrect address and correct them automatically.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/correct_address.png`,
        class: 'hex-4',
        breadCrumbs: 'Maintenance > Correct Names',
        category: 'correct_names',
        layout_id: 4,
        showSvg: false,
        mainHeadingClass: 'maintain',
        redirect: routeList.correct_details
    },     
    {
        type: 'category',
        name: 'Ownership',
        class: 'hex-5',
        mainHeadingClass: 'acquisition',
    },
    {
        type: 'menu',
        mainHeading: 'Invent',
        subHeading: 'Assign your employees\' inventions to the company.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/invent.png`,
        class: 'hex-6',
        breadCrumbs: 'Ownership > Invent',
        category: 'invent',
        layout_id: 5,
        showSvg: false,
        mainHeadingClass: 'acquisition',
        redirect: routeList.invent
    }, 
    {
        type: 'menu',
        mainHeading: 'Acquire Patents',
        subHeading: 'Import a list of patents, review them, exchange your view with peers, and draft a PPA.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/acquire_patents.png`,
        class: 'hex-7',
        breadCrumbs: 'Ownership > Acquire Patents',
        category: 'acquire_patents',
        layout_id: 6,
        showSvg: false,
        mainHeadingClass: 'acquisition',
        redirect: routeList.maintainence
    }, 
    {
        type: 'menu',
        mainHeading: 'Sell Patents',
        subHeading: 'Select patents from your portfolio, discuss them with your peers, and send them out to a broker/buyer, together with a comprehensive report.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/sell.png`,
        class: 'hex-8',
        breadCrumbs: 'Ownership > Sell Patents',
        category: 'sell_payments',
        layout_id: 7,
        showSvg: false,
        mainHeadingClass: 'acquisition',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'Insights',
        subHeading: 'Get a unique view of your assets. Explore your portfolio via collection of charts and KPI.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/insights.png`,
        class: 'hex-9',
        breadCrumbs: 'Ownership > Insights',
        category: 'insights',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'acquisition',
        redirect: routeList.maintainence
    },
    {
        type: 'category',
        name: 'Licensing',
        class: 'hex-10',
        mainHeadingClass: 'progress',
    },                
    {
        type: 'menu',
        mainHeading: 'License Out',
        subHeading: 'Select patents from your portfolio, discuss them with your peers, and send them out to a broker/licensees, together with a comprehensive report.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licenseout.png`,
        class: 'hex-11',
        breadCrumbs: 'Licensing > License Out',
        category: 'licenseout',
        layout_id: 8,
        showSvg: false,
        mainHeadingClass: 'progress',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'License In',
        subHeading: 'Import a list of patents, review them, exchange your view with peers, and draft your Patent License Agreement.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/licensein.png`,
        class: 'hex-12',
        breadCrumbs: 'Licensing > License In',
        category: 'licensein',
        layout_id: 9,
        showSvg: false,
        mainHeadingClass: 'progress',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'Income/Expense',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/income_expense.png`,
        class: 'hex-13',
        breadCrumbs: 'Licensing > Income/Expense',
        category: 'income_expense',
        layout_id: 10,
        showSvg: false,
        mainHeadingClass: 'progress',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'Survival Reports',
        subHeading: 'Produce reports showing the remaining life of patent portfolios you license out and license in.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/survival.png`,
        class: 'hex-14',
        breadCrumbs: 'Licensing > Survival Reports',
        category: 'reports',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'progress',
        redirect: routeList.maintainence
    },
    {
        type: 'category',
        name: 'Financing',
        class: 'hex-15',
        mainHeadingClass: 'bank',
    },                
    {
        type: 'menu',
        mainHeading: 'Secure a Loan',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/secure.png`,
        class: 'hex-16',
        breadCrumbs: 'Financing > Secure a Loan',
        /*category: 'secure_a_loan',*/
        category: 'correct_address',
        layout_id: 12,
        showSvg: false,
        mainHeadingClass: 'bank',
        redirect: routeList.correct_address
    },
    {
        type: 'menu',
        mainHeading: 'Reduce Interest Rate',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/reduce_interest_rate.png`,
        class: 'hex-17',
        breadCrumbs: 'Financing > Reduce Interest Rate',
        category: 'reduce_interest_rate',
        layout_id: 13,
        showSvg: false,
        mainHeadingClass: 'bank',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'Release Collateral',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/release_collateral.png`,
        class: 'hex-18',
        breadCrumbs: 'Financing > Release Collateral',
        category: 'release_collateral',
        layout_id: 14,
        showSvg: false,
        mainHeadingClass: 'bank',
        redirect: routeList.maintainence
    },
    {
        type: 'menu',
        mainHeading: 'Market Review',
        subHeading: 'Expose yourself and learn so much from all the  assignment activities out there.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/market_review.png`,
        class: 'hex-19',
        breadCrumbs: 'Financing > Market Review',
        category: 'market_review',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'bank',
        redirect: routeList.maintainence
    },
    {
        type: 'category',
        name: 'Due Diligence',
        class: 'hex-20',
        mainHeadingClass: 'correct',
    },                
    {
        type: 'menu',
        mainHeading: 'Legal Ownership',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/due_dilligence.png`,
        class: 'hex-21',
        breadCrumbs: 'Due Diligence > Legal Ownership',
        category: 'due_dilligence',
        layout_id: 15,
        showSvg: false,
        mainHeadingClass: 'correct',
        redirect: routeList.duedilligence
    },
    {
        type: 'menu',
        mainHeading: 'Technical Scope',
        subHeading: 'Get an immediate list of your patents involved in litigation.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/litigation.png`,
        class: 'hex-22',
        breadCrumbs: 'Legal > Technical Scope',
        category: 'technical_scope',
        layout_id: 16,
        showSvg: false,
        mainHeadingClass: 'correct',
        redirect: routeList.duedilligence
    },
    {
        type: 'menu',
        mainHeading: 'Prosecution Process',
        subHeading: 'Get an immediate list of your patents involved in PTAB procedures.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/ptab.png`,
        class: 'hex-23',
        breadCrumbs: 'Legal > Prosecution Process',
        category: 'prosecution_process',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'correct',
        redirect: routeList.duedilligence
    },
    {
        type: 'menu',
        mainHeading: 'Litigation / PAIR',
        subHeading: '',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/pair.png`,			
        class: 'hex-24',
        breadCrumbs: 'Legal > Litigation / PAIR',
        category: 'pair',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'correct',
        redirect: routeList.duedilligence
    },
    {
        type: 'category',
        name: 'Perfomance',
        class: 'hex-25',
        mainHeadingClass: 'read', 
    },                
    {
        type: 'menu',
        mainHeading: 'Lawyers',
        subHeading: 'An objective view of your lawyers\' performance, as well as that of other law firms.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/lawyers.png`,
        class: 'hex-26',
        breadCrumbs: 'Insights > Lawyers',
        category: 'lawyers',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'read',
        redirect: routeList.insights
    },
    {
        type: 'menu',
        mainHeading: 'Bankers',
        subHeading: 'An objective view of your bankers\' performance, as well as that of other banks.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/bankers.png`,
        breadCrumbs: 'Insights > Bankers',
        category: 'bankers',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'read',
        redirect: routeList.insights
    },
    {
        type: 'menu',
        mainHeading: 'Competitors',
        subHeading: 'Lean about your competitors activities.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/competitors.png`,
        class: 'hex-28',
        breadCrumbs: 'Insights > Competitors',
        category: 'competitors',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'read',
        redirect: routeList.insights
    },
    {
        type: 'menu',
        mainHeading: 'Inventors',
        subHeading: 'Analyse your invenotr\'s activities.',
        svg: '',
        image: `https://s3-us-west-1.amazonaws.com/static.patentrack.com/icons/menu/inventors.png`,
        class: 'hex-29',
        breadCrumbs: 'Insights > Inventors',
        category: 'inventors',
        layout_id: 0,
        showSvg: false,
        mainHeadingClass: 'read',
        redirect: routeList.insights
    }
]

export const menuControlList = [
    {
        name: 'Maintenance',
        children: [
            {
                mainHeading: 'Maintain\nPatents',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'maintain',
                redirect: routeList.review
            },
            {
                mainHeading: 'Restore\nOwnership',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'maintain',
                redirect: routeList.correct
            },       
            {
                mainHeading: 'Correct\nAddress',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'correct',
                redirect: routeList.correct
            },
            {
                mainHeading: 'Check\nProgress',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'progress',
                redirect: routeList.progress
            }
        ]
    }, 
    {
        name: 'Ownership',
        children: [
            {
                mainHeading: 'Inventors\nAssignment',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'acquisition',
                redirect: routeList.record
            },
            {
                mainHeading: 'Sell\nPatents',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'acquisition',
                redirect: routeList.review
            },
            {
                mainHeading: 'Buy\nPatents',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'acquisition',
                redirect: routeList.review
            },
            {
                mainHeading: 'Check\nProgress',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'progress',
                redirect: routeList.progress
            }
        ]
    },
    {
        name: 'Licensing',
        children: [
            {
                mainHeading: 'License\nIn',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'acquisition',
                redirect: routeList.review
            },        
            {
                mainHeading: 'License\nOut',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'acquisition',
                redirect: routeList.review
            },
            {
                mainHeading: 'Reports',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'correct',
                redirect: routeList.correct
            },
            {
                mainHeading: 'Check\nProgress',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'progress',
                redirect: routeList.progress
            }
        ]
    },
    {
        name: 'Financing',
        children: [
            {
                mainHeading: 'Secure a\nLoan',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'bank',
                redirect: routeList.review
            },
            {
                mainHeading: 'Reduce\nInterest Rate',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'bank',
                redirect: routeList.review
            },
            {
                mainHeading: 'Release\nCollateral',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'bank',
                redirect: routeList.review
            },
            {
                mainHeading: 'Check\nProgress',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'progress',
                redirect: routeList.progress
            }
        ]
    },
    {
        name: 'Due Diligence',
        children: [
            {
                mainHeading: 'Manage\nCounsel',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'correct',
                redirect: routeList.correct
            },
            {
                mainHeading: 'Reports',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'correct',
                redirect: routeList.correct
            },
            {
                mainHeading: 'Manage\nCounsel',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'correct',
                redirect: routeList.correct
            },
            {
                mainHeading: 'Manage\nBanks',
                subHeading: 'Identiy the patent which are due for payment of maintainance fee payment and pay afor all at once.',
                mainHeadingClass: 'progress',
                redirect: routeList.progress
            }
        ]
    }
]
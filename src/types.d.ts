export interface userData {
    id: string;
    name: string;
    surname: string;
    userName: string;
    password: string;
    area: string;
    role: string;
}

export interface createUserformValues {
    id: string,
    name: string,
    surname: string,
    userName: string,
    password: string,
    repeatPassword: string,
    area: string,
    role: string
}

export interface userLogin {
    userName: string;
    password: string;
    remember: boolean;
}

export interface client {
    id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    social: string;
    userName: string;
}

export interface createTicketFormValues {
    title: string
    description: string
    type: string
    image: string
}

export interface closeTicketFormValues {
    solution: string
    solvedBy: string
    closed: boolean
}

export interface ticket {
    id: string
    userId: string
    userName: string
    area: string
    date: string
    title: string
    type: string
    description: string
    solution: string
    solvedBy: string
    solvedDate: string
    image: string
    closed: boolean
}

export interface statistics {
    ticketsPerArea: Record<string, number>;
    averageResponseTime: number;
    todayTickets: number;
    totalTickets: number;
    ticketsByUser: Record<string, number>
    ticketsByType: Record<string, number>
}
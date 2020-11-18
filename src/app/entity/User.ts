export interface User{
	id: number;
	enable: boolean;
	password: string;
	roles: string;
	username: string;
	email: string;
	lastPassword: string;
	lastPasswordModifyTime: Date;
	level: number;
}

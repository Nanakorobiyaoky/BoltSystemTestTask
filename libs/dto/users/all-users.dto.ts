import { ClientUserEntity } from '../../entities/users/client-user.entity';

export class AllUsersDto {
  usersAuthors: ClientUserEntity[];
  usersEditors: ClientUserEntity[];
}

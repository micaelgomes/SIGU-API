import { MigrationInterface, QueryRunner } from 'typeorm';

export default class SeedAdminUser1612272603670 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminUser = {
      name: 'admin',
      email: 'user@admin.com',
      password: '$2a$08$tryEgGspGbxYv3pTN/JtiucC1MI4YOf3TC4UxEHT0eWzZSTG/nRa6', // admin
    };

    await queryRunner.manager.save(adminUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminUser = {
      name: 'admin',
      email: 'user@admin.com',
      password: '$2a$08$tryEgGspGbxYv3pTN/JtiucC1MI4YOf3TC4UxEHT0eWzZSTG/nRa6', // admin
    };

    await queryRunner.manager.delete(adminUser);
  }
}

<?php

namespace App\DataFixtures;

use App\Entity\User;
use Faker\Factory;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{

    /**
     * Encoder de mot de passe
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    /**
     * AppFixtures constructor.
     * @param UserPasswordEncoderInterface $encoder
     */
    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for ($u = 0; $u < 10; $u++) {
            $user =  new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, 'password');
            $user
                ->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($hash)
                ;
            $manager->persist($user);
            for ($c = 0; $c < random_int(5,20); $c++) {
                $customer =  new Customer();
                $customer
                    ->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company)
                    ->setUser($user)
                ;
                $manager->persist($customer);

                for ($i = 0; $i < random_int(3, 10); $i++) {

                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 250, 3500))
                        ->setSentAt($faker->dateTimeBetween('-6months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);
                    $chrono++;
                    $manager->persist($invoice);
                }
            }

        }


        $manager->flush();
    }
}

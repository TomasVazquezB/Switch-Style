namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

class FirebaseService
{
    protected $firestore;

    public function __construct()
    {
        $factory = (new Factory)
            ->withServiceAccount(config('services.firebase.credentials'));

        $this->firestore = $factory->createFirestore()->database();
    }

    public function getFirestore()
    {
        return $this->firestore;
    }
}